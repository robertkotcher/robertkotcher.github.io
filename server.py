import http.server
from http.server import HTTPServer, BaseHTTPRequestHandler
import socketserver

PORT = 80

Handler = http.server.SimpleHTTPRequestHandler

Handler.extensions_map={
        '.html': 'text/html;charset=UTF-8',
        '.csv': 'text/csv;charset=UTF-8',
        '': 'text/plain;charset=UTF-8',
}

httpd = socketserver.TCPServer(("", PORT), Handler)

print("serving at port", PORT)
httpd.serve_forever()
