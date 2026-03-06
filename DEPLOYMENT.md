# Deployment Guide - Summit Commercial Construction Website

This guide covers deploying the Summit Commercial Construction website to an Ubuntu VPS using Docker and Docker Compose.

## Architecture Decision

**Selected Approach: Static Site (Option A)**

The website is deployed as a static site built by Vite and served by Nginx. This approach provides:

- **Best Performance**: No server-side rendering overhead, instant page loads
- **Simplest Operations**: Single container, minimal moving parts
- **Excellent Security**: Minimal attack surface, no runtime dependencies
- **Cost Effective**: Low resource usage, can run on small VPS instances
- **Future API Path**: The Nginx config includes a commented `/api/` proxy block for future backend integration

## Prerequisites

### DNS Setup

Before deployment, configure your DNS:

1. **A Record**: Point your domain to your VPS IP address
   ```
   Type: A
   Name: @
   Value: YOUR_VPS_IP
   TTL: 3600
   ```

2. **WWW CNAME** (optional):
   ```
   Type: CNAME
   Name: www
   Value: yourdomain.com
   TTL: 3600
   ```

3. **Wait for propagation** (can take up to 48 hours, usually 5-30 minutes)

### VPS Requirements

- Ubuntu 22.04 LTS or 24.04 LTS
- Minimum 1GB RAM, 1 vCPU
- 10GB available disk space
- Root or sudo access

## Server Setup

### 1. Initial Server Setup

Connect to your VPS via SSH:
```bash
ssh ubuntu@YOUR_VPS_IP
```

Update system packages:
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Docker

```bash
# Remove old versions
sudo apt remove docker docker-engine docker.io containerd runc

# Install prerequisites
sudo apt install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Verify installation
sudo docker --version
sudo docker compose version

# Add user to docker group (optional, for running docker without sudo)
sudo usermod -aG docker $USER
# Log out and back in for this to take effect
```

### 3. Configure UFW Firewall

```bash
# Install UFW if not present
sudo apt install -y ufw

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (important! don't lock yourself out)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status verbose
```

### 4. Create Directory Structure

```bash
# Create application directory
sudo mkdir -p /home/ubuntu/apps/summit-website
cd /home/ubuntu/apps/summit-website

# Set ownership
sudo chown -R ubuntu:ubuntu /home/ubuntu/apps
```

## Deployment

### Option 1: Manual Deployment

1. **Upload the project files** to `/home/ubuntu/apps/summit-website/`

   Using SCP from your local machine:
   ```bash
   scp -r gc-illinois-site.zip ubuntu@YOUR_VPS_IP:/home/ubuntu/apps/summit-website/
   ```

   Then on the server:
   ```bash
   cd /home/ubuntu/apps/summit-website
   unzip gc-illinois-site.zip
   mv gc-illinois-site/* .
   rm -rf gc-illinois-site gc-illinois-site.zip
   ```

2. **Build and start the containers**:
   ```bash
   cd /home/ubuntu/apps/summit-website
   docker compose up -d --build
   ```

3. **Verify deployment**:
   ```bash
   docker compose ps
   docker compose logs -f
   ```

### Option 2: Git-Based Deployment

1. **Initialize git repository on server**:
   ```bash
   cd /home/ubuntu/apps/summit-website
   git init
   git config user.email "deploy@summitcommercial-il.com"
   git config user.name "Deploy User"
   ```

2. **Add remote and push from local**:
   ```bash
   # On local machine
   git remote add production ssh://ubuntu@YOUR_VPS_IP/home/ubuntu/apps/summit-website
   git push production main
   ```

3. **Deploy hook** (optional, for auto-deploy):
   Create `.git/hooks/post-receive`:
   ```bash
   #!/bin/bash
   cd /home/ubuntu/apps/summit-website
   git --git-dir=/home/ubuntu/apps/summit-website/.git --work-tree=/home/ubuntu/apps/summit-website checkout -f
   docker compose up -d --build
   ```
   ```bash
   chmod +x .git/hooks/post-receive
   ```

## HTTPS Setup (Let's Encrypt)

### Option A: Certbot on Host (Recommended for Simplicity)

1. **Install Certbot**:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   ```

2. **Obtain certificate**:
   ```bash
   sudo certbot certonly --standalone -d summitcommercial-il.com -d www.summitcommercial-il.com
   ```

3. **Update nginx-site.conf** to use HTTPS (uncomment the HTTPS server block)

4. **Copy certificates to project**:
   ```bash
   sudo mkdir -p /home/ubuntu/apps/summit-website/ssl
   sudo cp /etc/letsencrypt/live/summitcommercial-il.com/fullchain.pem /home/ubuntu/apps/summit-website/ssl/
   sudo cp /etc/letsencrypt/live/summitcommercial-il.com/privkey.pem /home/ubuntu/apps/summit-website/ssl/
   sudo chown -R ubuntu:ubuntu /home/ubuntu/apps/summit-website/ssl
   ```

5. **Auto-renewal**:
   ```bash
   sudo certbot renew --dry-run
   # Add to crontab for auto-renewal
   echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
   ```

### Option B: Let's Encrypt with Docker (nginx-proxy + acme-companion)

See `docker-compose.letsencrypt.yml` for this configuration.

## Update Procedure

### Zero-Downtime Updates (Static Site)

For static sites, updates are nearly instant:

```bash
cd /home/ubuntu/apps/summit-website

# Pull latest changes (if using git)
git pull

# Rebuild and restart
docker compose up -d --build

# Verify
sleep 5
curl -f http://localhost:8080/healthz
```

### Rollback Strategy

If an update fails:

```bash
cd /home/ubuntu/apps/summit-website

# Revert to previous git commit
git log --oneline -5
git revert HEAD
docker compose up -d --build

# Or restore from backup
cp -r backups/backup-$(date +%Y%m%d)/* .
docker compose up -d --build
```

## Monitoring & Logging

### View Logs

```bash
# All services
docker compose logs

# Follow logs
docker compose logs -f

# Specific service
docker compose logs -f website

# Last 100 lines
docker compose logs --tail=100
```

### Log Locations

- **Nginx access logs**: `/var/log/nginx/site-access.log` (inside container)
- **Nginx error logs**: `/var/log/nginx/site-error.log` (inside container)
- **Docker logs**: `docker compose logs`

### Health Checks

```bash
# Check container health
docker compose ps

# Test health endpoint
curl http://localhost:8080/healthz

# External health check
curl -I https://summitcommercial-il.com/healthz
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker compose logs website

# Check for port conflicts
sudo netstat -tlnp | grep 8080

# Restart with fresh build
docker compose down
docker compose up -d --build --force-recreate
```

### 502 Bad Gateway

```bash
# Check if website container is running
docker compose ps

# Check container logs
docker compose logs website

# Restart services
docker compose restart
```

### SSL Certificate Issues

```bash
# Check certificate expiry
openssl x509 -in /etc/letsencrypt/live/summitcommercial-il.com/fullchain.pem -noout -dates

# Renew manually
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

### High Memory Usage

```bash
# Check container stats
docker stats

# Restart container
docker compose restart website

# Prune unused images
docker system prune -a
```

## Security Checklist

- [ ] UFW firewall enabled
- [ ] SSH key authentication (disable password auth)
- [ ] Automatic security updates enabled
- [ ] Docker running as non-root user
- [ ] SSL/TLS certificates installed
- [ ] Security headers configured in Nginx
- [ ] Container resource limits set
- [ ] Logs monitored regularly
- [ ] Backups configured

## Backup Strategy

```bash
# Create backup script
cat > /home/ubuntu/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# Backup website files
cp -r /home/ubuntu/apps/summit-website $BACKUP_DIR/

# Backup SSL certificates
sudo cp -r /etc/letsencrypt $BACKUP_DIR/

# Compress
 tar -czf $BACKUP_DIR.tar.gz -C /home/ubuntu/backups $(basename $BACKUP_DIR)
rm -rf $BACKUP_DIR

# Keep only last 7 backups
ls -t /home/ubuntu/backups/*.tar.gz | tail -n +8 | xargs rm -f
EOF

chmod +x /home/ubuntu/backup.sh

# Add to crontab (daily at 2 AM)
echo "0 2 * * * /home/ubuntu/backup.sh" | crontab -
```

## Performance Optimization

### Enable Brotli Compression (Optional)

1. Use Nginx image with Brotli module
2. Uncomment Brotli settings in `nginx.conf`

### CDN Integration

For production, consider using a CDN (CloudFlare, AWS CloudFront):

1. Sign up for CDN service
2. Update DNS to point to CDN
3. Configure origin server
4. Enable caching rules

## Support

For issues or questions:
- Check logs: `docker compose logs -f`
- Test health: `curl http://localhost:8080/healthz`
- Review Nginx config: `docker exec summit-website cat /etc/nginx/conf.d/site.conf`
