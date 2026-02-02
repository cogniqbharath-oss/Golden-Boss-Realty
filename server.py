import http.server
import socketserver
import os
import json
import urllib.request

PORT = 8000

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/chat':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            # This is a proxy to test the chatbot locally if needed
            # For now, it just echoes back for demo purposes or you can add real logic
            response = {
                "response": "Hello! I'm the Golden Boss Realty assistant. How can I help you find your dream home in Zirakpur today?"
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())
        else:
            super().do_POST()

Handler = MyHandler

print(f"Serving at http://localhost:{PORT}")
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    httpd.serve_forever()
