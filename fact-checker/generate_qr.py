import qrcode
import os

# URL of the hosted fact-checking app
url = "http://fact-checker-app-demo-2025.s3-website-us-east-1.amazonaws.com"

# Generate QR code
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)
qr.add_data(url)
qr.make(fit=True)

# Create an image from the QR Code
img = qr.make_image(fill_color="black", back_color="white")

# Save the image
output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fact_checker_app_qr.png")
img.save(output_path)

print(f"QR code generated and saved to: {output_path}")
