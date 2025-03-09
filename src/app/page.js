"use client";
import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, doc, updateDoc, arrayUnion, arrayRemove, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { 
  Box, Card, CardContent, CardHeader, CardMedia, Divider, IconButton, 
  Stack, Typography, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,
  Menu, MenuItem, ListItemIcon, ListItemText, Snackbar
} from "@mui/material";
import { Favorite, FavoriteBorder, Comment, Share, MoreVert, Send,
  ContentCopy, Facebook, Twitter, WhatsApp, Delete, Edit, Report, Flag
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import CreatePost from "@/component/CreatePost";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [commentOpen, setCommentOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const { user } = useSelector((state) => state.app);
  const [shareAnchorEl, setShareAnchorEl] = useState(null);
  const [sharePost, setSharePost] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editText, setEditText] = useState('');

  const fetchPosts = async () => {
    try {
      const postsRef = collection(db, "posts");
      const q = query(postsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        likes: doc.data().likes || [],
        comments: doc.data().comments || []
      }));
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      const postRef = doc(db, "posts", postId);
      const post = posts.find(p => p.id === postId);
      const isLiked = post.likes.includes(user.uid);

      await updateDoc(postRef, {
        likes: isLiked 
          ? arrayRemove(user.uid)
          : arrayUnion(user.uid)
      });

      fetchPosts(); // Refresh posts to show updated likes
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handleCommentOpen = (post) => {
    setSelectedPost(post);
    setCommentOpen(true);
  };

  const handleCommentClose = () => {
    setCommentOpen(false);
    setSelectedPost(null);
    setCommentText('');
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const postRef = doc(db, "posts", selectedPost.id);
      const newComment = {
        text: commentText,
        author: {
          uid: user.uid,
          name: user.name,
          photoURL: user.photoURL
        },
        createdAt: new Date().toISOString()
      };

      await updateDoc(postRef, {
        comments: arrayUnion(newComment)
      });

      handleCommentClose();
      fetchPosts();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleShare = (post, event) => {
    setSharePost(post);
    setShareAnchorEl(event.currentTarget);
  };

  const handleShareClose = () => {
    setShareAnchorEl(null);
    setSharePost(null);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setSnackbarMessage('Link copied to clipboard!');
      setSnackbarOpen(true);
      handleShareClose();
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleSocialShare = (platform) => {
    const postUrl = window.location.href;
    const text = sharePost.text;
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(postUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${postUrl}`)}`;
        break;
      default:
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      handleShareClose();
    }
  };

  const handleMenuOpen = (event, post) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedPost(post);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedPost(null);
  };

  const handleDeletePost = async () => {
    try {
      if (!selectedPost) return;
      
      if (selectedPost.author.uid !== user.uid) {
        setSnackbarMessage("You can only delete your own posts");
        setSnackbarOpen(true);
        return;
      }

      await deleteDoc(doc(db, "posts", selectedPost.id));
      fetchPosts();
      handleMenuClose();
      setSnackbarMessage("Post deleted successfully");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting post:", error);
      setSnackbarMessage("Failed to delete post");
      setSnackbarOpen(true);
    }
  };

  const handleReportPost = () => {
    handleMenuClose();
    setSnackbarMessage("Post reported. We'll review it soon.");
    setSnackbarOpen(true);
  };

  const handleEditOpen = (post) => {
    setEditText(post.text);
    setSelectedPost(post);
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setSelectedPost(null);
    setEditText('');
  };

  const handleEditPost = async () => {
    try {
      if (!selectedPost || !editText.trim()) return;

      const postRef = doc(db, "posts", selectedPost.id);
      
      // Create update object
      const updateData = {
        text: editText.trim(),
        edited: true,
        editedAt: serverTimestamp(),
        lastEditedBy: {
          uid: user.uid,
          name: user.name
        }
      };

      await updateDoc(postRef, updateData);
      await fetchPosts(); // Refresh posts
      handleEditClose();
      setSnackbarMessage("Post updated successfully");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating post:", error);
      setSnackbarMessage("Failed to update post");
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Box sx={{ maxWidth: 680, mx: 'auto', px: { xs: 2, md: 0 }, py: 3 }}>
        <CreatePost onPostCreated={fetchPosts} />

        <Stack spacing={3}>
          {posts.map((post) => (
            <Card
              key={post.id}
              elevation={2}
              sx={{
                borderRadius: 3,
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease',
                }
              }}
            >
              <CardHeader
                avatar={
                  <Avatar src={post.author?.photoURL}>
                    {post.author?.name?.[0]}
                  </Avatar>
                }
                action={
                  <IconButton onClick={(e) => handleMenuOpen(e, post)}>
                    <MoreVert />
                  </IconButton>
                }
                title={post.author?.name}
                subheader={
                  <>
                    {new Date(post.createdAt?.toDate()).toLocaleDateString()}
                    {post.edited && (
                      <Typography 
                        component="span" 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ ml: 1 }}
                      >
                        • Edited
                      </Typography>
                    )}
                  </>
                }
              />
              {post.imageUrl && (
                <CardMedia
                  component="img"
                  height="400"
                  image={post.imageUrl}
                  alt={post.text}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent>
                <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
                  {post.text}
                </Typography>

                {post.comments?.length > 0 && (
                  <Box sx={{ my: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Comments ({post.comments.length})
                    </Typography>
                    {post.comments.slice(0, 2).map((comment, index) => (
                      <Stack key={index} direction="row" spacing={1} sx={{ mb: 1 }}>
                        <Avatar
                          src={comment.author.photoURL}
                          sx={{ width: 24, height: 24 }}
                        >
                          {comment.author.name[0]}
                        </Avatar>
                        <Typography variant="body2">
                          <strong>{comment.author.name}</strong> {comment.text}
                        </Typography>
                      </Stack>
                    ))}
                  </Box>
                )}

                <Divider sx={{ my: 1 }} />
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={1}
                >
                  <Stack direction="row" spacing={1}>
                    <IconButton 
                      color={post.likes?.includes(user.uid) ? "primary" : "default"}
                      onClick={() => handleLike(post.id)}
                    >
                      {post.likes?.includes(user.uid) ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                    <Typography color="text.secondary" alignSelf="center">
                      {post.likes?.length || 0}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <IconButton onClick={() => handleCommentOpen(post)}>
                      <Comment />
                    </IconButton>
                    <IconButton onClick={(e) => handleShare(post, e)}>
                      <Share />
                    </IconButton>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>

        {/* Comment Dialog */}
        <Dialog 
          open={commentOpen} 
          onClose={handleCommentClose}
          fullWidth
          maxWidth="sm"
        >
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Add Comment
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={handleCommentClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                endIcon={<Send />}
                onClick={handleAddComment}
                disabled={!commentText.trim()}
              >
                Comment
              </Button>
            </Stack>
          </Box>
        </Dialog>

        {/* Share Menu */}
        <Menu
          anchorEl={shareAnchorEl}
          open={Boolean(shareAnchorEl)}
          onClose={handleShareClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleCopyLink}>
            <ListItemIcon>
              <ContentCopy fontSize="small" />
            </ListItemIcon>
            <ListItemText>Copy Link</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleSocialShare('facebook')}>
            <ListItemIcon>
              <Facebook fontSize="small" sx={{ color: '#1877f2' }} />
            </ListItemIcon>
            <ListItemText>Share on Facebook</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleSocialShare('twitter')}>
            <ListItemIcon>
              <Twitter fontSize="small" sx={{ color: '#1da1f2' }} />
            </ListItemIcon>
            <ListItemText>Share on Twitter</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleSocialShare('whatsapp')}>
            <ListItemIcon>
              <WhatsApp fontSize="small" sx={{ color: '#25d366' }} />
            </ListItemIcon>
            <ListItemText>Share on WhatsApp</ListItemText>
          </MenuItem>
        </Menu>

        {/* Menu for post actions */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {selectedPost?.author.uid === user.uid ? (
            <>
              <MenuItem onClick={() => handleEditOpen(selectedPost)}>
                <ListItemIcon>
                  <Edit fontSize="small" />
                </ListItemIcon>
                <ListItemText>Edit Post</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleDeletePost}>
                <ListItemIcon>
                  <Delete fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText sx={{ color: 'error.main' }}>Delete Post</ListItemText>
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem onClick={handleReportPost}>
                <ListItemIcon>
                  <Flag fontSize="small" color="warning" />
                </ListItemIcon>
                <ListItemText>Report Post</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <Report fontSize="small" />
                </ListItemIcon>
                <ListItemText>Not Interested</ListItemText>
              </MenuItem>
            </>
          )}
        </Menu>

        {/* Edit Post Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={handleEditClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit Post</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              multiline
              rows={4}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button 
              variant="contained"
              onClick={handleEditPost}
              disabled={!editText.trim()}
              color="primary"
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Box>
    </>
  );
}
