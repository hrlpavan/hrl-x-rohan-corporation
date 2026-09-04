#!/usr/bin/env python3
import http.server
import socketserver
import mimetypes
import os
import sys

# Ensure audio and web MIME types are configured for browser compatibility
mimetypes.add_type('audio/mp4', '.m4a')
mimetypes.add_type('audio/wav', '.wav')
mimetypes.add_type('video/webm', '.webm')
mimetypes.add_type('text/javascript', '.js')
mimetypes.add_type('text/css', '.css')
mimetypes.add_type('text/html', '.html')
mimetypes.add_type('image/jpeg', '.jpg')
mimetypes.add_type('image/png', '.png')

BASE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src')

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, format, *args):
        sys.stdout.write(f"[{self.log_date_time_string()}] {format % args}\n")
        sys.stdout.flush()

PORT = 3000
if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print(f"🚀 HRL International × Rohan Corporation Server running at http://localhost:{PORT}/")
        print(f"🎬 Explainer Video Theater: http://localhost:{PORT}/video.html")
        sys.stdout.flush()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
