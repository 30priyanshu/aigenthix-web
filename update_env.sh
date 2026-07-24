sed -i 's|http://aigenthix-website.avihm.site|https://aigenthix.com|g' ~/Aigenthix_Website_design/.env
sed -i 's|CORS_ORIGINS=.*|CORS_ORIGINS=http://ec2-18-61-102-27.ap-south-2.compute.amazonaws.com,https://aigenthix.com,https://www.aigenthix.com,http://18.61.102.27:3000,http://18.61.102.27|' ~/Aigenthix_Website_design/.env

# Update nginx.conf on EC2
sed -i 's|script-src '\''self'\'' '\''unsafe-inline'\'' '\''unsafe-eval'\''|script-src '\''self'\'' '\''unsafe-inline'\'' '\''unsafe-eval'\'' https://unpkg.com https://static.cloudflareinsights.com https://apis.google.com https://www.gstatic.com|' ~/Aigenthix_Website_design/website-v2/nginx.conf
sed -i 's|frame-src '\''self'\'' https://www.youtube.com https://player.vimeo.com|frame-src '\''self'\'' https://www.youtube.com https://player.vimeo.com https://aigenthix-website-login.firebaseapp.com https://accounts.google.com|' ~/Aigenthix_Website_design/website-v2/nginx.conf

cd ~/Aigenthix_Website_design
sudo docker compose up -d --build website backend
