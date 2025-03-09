"use client";
import { useState } from 'react';
import { db, storage } from "@/utils/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Avatar, IconButton, Paper, Stack, TextField, Box, Popover } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Image, EmojiEmotions, Send, Close } from "@mui/icons-material";
import { useSelector } from "react-redux";
import EmojiPicker from 'emoji-picker-react';

export default function CreatePost({ onPostCreated }) {
  const [loading, setLoading] = useState(false);
  const [postText, setPostText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useSelector((state) => state.app);

  const handleEmojiClick = (emojiData, event) => {
    setPostText((prevText) => prevText + emojiData.emoji);
    setAnchorEl(null);
  };

  const handleEmojiOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleEmojiClose = () => {
    setAnchorEl(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleCreatePost = async () => {
    if (!postText.trim()) return;

    setLoading(true);
    try {
      let imageUrl = null;

      if (imageFile) {
        const imageRef = ref(storage, `posts/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const postData = {
        text: postText,
        imageUrl,
        author: {
          uid: user.uid,
          name: user.name,
          photoURL: user.photoURL,
        },
        createdAt: serverTimestamp(),
        likes: 0,
        comments: [],
      };

      await addDoc(collection(db, "posts"), postData);
      setPostText('');
      setImageFile(null);
      setImagePreview(null);
      if (onPostCreated) onPostCreated();
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 3,
        background: 'white',
      }}
    >
      <Stack direction="row" spacing={2}>
        <Avatar 
          src={user?.photoURL}
          alt={user?.name}
          sx={{ width: 40, height: 40 }}
        >
          {user?.name?.[0]}
        </Avatar>
        <Stack spacing={2} flexGrow={1}>
          <TextField
            multiline
            rows={2}
            placeholder={`What's on your mind, ${user?.firstName}?`}
            variant="outlined"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          
          {imagePreview && (
            <Box sx={{ position: 'relative', width: 'fit-content' }}>
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ 
                  maxHeight: 200, 
                  borderRadius: 8,
                  objectFit: 'cover'
                }} 
              />
              <IconButton
                onClick={handleRemoveImage}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                  }
                }}
              >
                <Close />
              </IconButton>
            </Box>
          )}

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1}>
              <IconButton
                color="primary"
                component="label"
              >
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleImageChange}
                />
                <Image />
              </IconButton>
              <IconButton 
                color="primary"
                onClick={handleEmojiOpen}
              >
                <EmojiEmotions />
              </IconButton>
              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleEmojiClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                sx={{
                  '& .EmojiPickerReact': {
                    '--epr-bg-color': '#fff',
                    '--epr-category-label-bg-color': '#f8f9fa',
                  }
                }}
              >
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  autoFocusSearch={false}
                />
              </Popover>
            </Stack>
            <LoadingButton
              loading={loading}
              disabled={!postText.trim()}
              variant="contained"
              endIcon={<Send />}
              onClick={handleCreatePost}
              sx={{
                borderRadius: 2,
                px: 3,
              }}
            >
              Post
            </LoadingButton>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
} 