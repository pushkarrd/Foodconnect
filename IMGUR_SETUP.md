# 🖼️ Imgur Integration Setup Guide

## Quick Start: 3 Steps

### Step 1: Get Your Imgur Client ID (2 minutes)

1. Go to: https://api.imgur.com/oauth2/addclient
2. Fill in the form:
   - **Application name**: FoodConnect
   - **Authorization type**: OAuth 2 authorization without a callback URL
   - **Email**: Your email
   - **Description**: Food donation image uploads

3. Click "Submit"
4. You'll see your **Client ID** - copy it

### Step 2: Add Client ID to .env

Open `.env` and replace:

```env
VITE_IMGUR_CLIENT_ID=YOUR_IMGUR_CLIENT_ID
```

With your actual Client ID (paste what you copied):

```env
VITE_IMGUR_CLIENT_ID=abc123xyz789
```

### Step 3: Test It!

1. Start the dev server: `npm run dev`
2. Go to Add Donation page
3. Upload an image
4. Click "Create Donation"

## ✅ What's New

- **Image upload field** in Add Donation form
- **Image preview** before uploading
- **Automatic upload** to Imgur when creating donation
- **Free tier**: 50MB per image, unlimited uploads
- **No billing required** - completely free!

## 📋 File Changes

| File | Changes |
|------|---------|
| `src/services/imgurService.js` | NEW - Imgur upload service |
| `src/services/donationService.js` | Added imageUrl & imageDeleteHash fields |
| `src/pages/donor/AddDonation.jsx` | Added image input, preview, upload logic |
| `.env` | Added VITE_IMGUR_CLIENT_ID |

## 🎯 Features

✅ Image preview before upload
✅ Automatic upload on donation creation
✅ Error handling for large files
✅ File type validation
✅ Remove image option
✅ Free tier support

## ⚠️ Image Stored In

- **URL**: Stored in Firestore as `imageUrl` field
- **Delete Hash**: Stored as `imageDeleteHash` (optional - for future deletion)
- **Hosting**: Imgur CDN (no Firebase Storage needed!)

## 🐛 Troubleshooting

**Error: "Missing or insufficient permissions"**
- Make sure you added the Client ID to `.env`
- Restart the dev server after adding it

**Error: "Invalid image format"**
- Only JPEG, PNG, GIF, WebP are supported
- Convert your image if needed

**Error: "Image size exceeds 50MB"**
- Your image is too large
- Compress it before uploading

## 📚 API Limits (Free Tier)

- Max file size: 50MB
- Upload limit: Unlimited
- Daily limit: 1,250 uploads per day
- Monthly limit: Unlimited total uploads

## 🔐 Security Notes

- Client ID is public (it's meant to be)
- No sensitive data in image uploads
- Imgur handles all image storage
- Donation data still in Firestore

## 📱 Mobile Testing

Image uploads work on mobile devices too!

---

**Questions?** Check Imgur docs: https://apidocs.imgur.com/
