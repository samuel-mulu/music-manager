# Backend Deployment Guide for Render

This guide will help you deploy the Addis Software backend to Render.

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **MongoDB Database**: Either MongoDB Atlas or Render's managed MongoDB
3. **GitHub Repository**: Your code should be in a GitHub repository

## Deployment Steps

### 1. Prepare Your Repository

Make sure your backend code is committed and pushed to GitHub with all the necessary files:

- `package.json` with updated scripts
- `render.yaml` configuration
- `env.example` for environment variables reference
- Health check endpoint at `/health`

### 2. Create a New Web Service on Render

1. Go to your Render dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select your backend repository

### 3. Configure the Service

#### Basic Settings:

- **Name**: `addis-software-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)

#### Build & Deploy Settings:

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start:prod`
- **Health Check Path**: `/health`

### 4. Environment Variables

Set the following environment variables in Render dashboard:

#### Required Variables:

```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/addis_songs?retryWrites=true&w=majority
FRONTEND_URL=https://your-frontend-url.onrender.com
```

#### Security Variables:

```
JWT_SECRET=your-super-secret-jwt-key-here
BCRYPT_ROUNDS=12
```

#### Optional Variables:

```
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 5. Database Setup

#### Option A: MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster
3. Create a database user
4. Whitelist Render's IP addresses (0.0.0.0/0 for all IPs)
5. Get your connection string and set it as `MONGO_URI`

#### Option B: Render's Managed MongoDB

1. In Render dashboard, create a new MongoDB database
2. Use the provided connection string as `MONGO_URI`

### 6. Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy your application
3. Monitor the build logs for any issues
4. Once deployed, your API will be available at: `https://your-service-name.onrender.com`

## Post-Deployment Configuration

### 1. Update Frontend URL

Make sure to update your frontend application to point to the deployed backend URL.

### 2. Test the API

Test your deployed API:

```bash
curl https://your-service-name.onrender.com/health
```

### 3. Monitor Logs

Check the Render dashboard for application logs and any errors.

## Troubleshooting

### Common Issues:

#### Build Failures:

- Check that all dependencies are in `package.json`
- Ensure TypeScript compilation works locally
- Verify build scripts are correct

#### Runtime Errors:

- Check environment variables are set correctly
- Verify database connection string
- Check CORS configuration

#### Health Check Failures:

- Ensure `/health` endpoint is accessible
- Check that the server starts without errors

### Logs Access:

1. Go to your service in Render dashboard
2. Click on "Logs" tab
3. Check for any error messages

## Performance Optimization

### For Production:

1. **Database Indexing**: Ensure proper MongoDB indexes
2. **Connection Pooling**: MongoDB connection pooling is handled automatically
3. **Caching**: Consider adding Redis for caching (optional)
4. **Rate Limiting**: Already configured in the application

### Scaling:

- Start with the "Starter" plan
- Upgrade to higher plans as your traffic grows
- Consider using Render's auto-scaling features

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to git
2. **CORS**: Configure CORS properly for production
3. **HTTPS**: Render provides HTTPS automatically
4. **Database**: Use strong passwords and restrict database access

## Monitoring

1. **Health Checks**: Monitor the `/health` endpoint
2. **Logs**: Regularly check application logs
3. **Metrics**: Use Render's built-in metrics dashboard
4. **Alerts**: Set up alerts for service downtime

## Backup Strategy

1. **Database Backups**: Configure MongoDB Atlas backups
2. **Code Backups**: Your code is backed up in GitHub
3. **Environment Variables**: Document your environment variables securely

## Support

- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **MongoDB Atlas Documentation**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Node.js Best Practices**: [github.com/goldbergyoni/nodebestpractices](https://github.com/goldbergyoni/nodebestpractices)

---

## Quick Deployment Checklist

- [ ] Code committed to GitHub
- [ ] `render.yaml` configured
- [ ] Environment variables documented
- [ ] Health check endpoint working
- [ ] CORS configured for production
- [ ] MongoDB database ready
- [ ] Frontend URL updated
- [ ] JWT secret generated
- [ ] Build command tested locally
- [ ] Deploy and test API endpoints
