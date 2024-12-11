document.getElementById('urlForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
    
    const formData = {
        url: document.getElementById('url').value,
        customSlug: document.getElementById('customSlug').value,
        password: document.getElementById('password').value,
        expiresIn: document.getElementById('expiresIn').value
    };

    try {
        const response = await fetch('/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.error
            });
            return;
        }

        document.getElementById('shortUrl').value = data.shortUrl;
        document.getElementById('qrCode').src = data.qrCode;
        document.getElementById('qrDownload').href = data.qrCode;
        
        // Animate result container
        const result = document.getElementById('result');
        result.style.display = 'block';
        result.scrollIntoView({ behavior: 'smooth' });

        Swal.fire({
            icon: 'success',
            title: 'URL Shortened!',
            text: 'Your shortened URL is ready to use',
            timer: 2000,
            showConfirmButton: false
        });

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Something went wrong. Please try again.'
        });
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-cut me-2"></i>Shorten URL';
    }
});

function copyToClipboard() {
    const shortUrl = document.getElementById('shortUrl');
    shortUrl.select();
    document.execCommand('copy');
    
    Swal.fire({
        icon: 'success',
        title: 'Copied!',
        text: 'URL has been copied to clipboard',
        timer: 1500,
        showConfirmButton: false,
        position: 'top-end',
        toast: true
    });
}