// Helper function to convert base64url to Uint8Array
function base64urlToUint8Array(base64url) {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    let pad = base64.length % 4;
    // Add padding if necessary
    if (pad) {
        for (let i = 0; i < pad; i++) {
            base64 += '=';
        }
    }
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

// Helper function to convert Uint8Array to base64url
function uint8ToBase64url(uint8) {
    return btoa(String.fromCharCode.apply(null, uint8))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

document.addEventListener('DOMContentLoaded', () => {
    const loginPasskeyBtn = document.getElementById('loginPasskeyBtn');
    const loginPasswordBtn = document.getElementById('loginPasswordBtn');
    const usernameEmailInput = document.getElementById('usernameEmail');
    const passwordInput = document.getElementById('password'); // Password input element
    const statusMessage = document.getElementById('statusMessage'); // Element to display status messages

    // Helper function to update the status message with different types (success, error, info)
    function updateStatus(message, type = 'info') {
        statusMessage.textContent = message;
        statusMessage.style.color = ''; // Reset to default color
        if (type === 'success') {
            statusMessage.style.color = 'var(--success-color)';
        } else if (type === 'error') {
            statusMessage.style.color = 'var(--error-color)';
        } else { // info
            statusMessage.style.color = 'var(--info-color)';
        }
    }

    // Function to handle Passkey login process
    async function loginWithPasskey(username = null) {
        updateStatus('Attempting to log in with Passkey...', 'info');

        try {
            // Step 1: Request login options (like a challenge) from your server
            // If a username is provided, the server can look for passkeys associated with that user.
            // Otherwise, it might attempt a discoverable credential login.
            const response = await fetch('/api/login/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to get login options from server.');
            }
            const options = await response.json();

            // Convert challenge and credential IDs from Base64URL to Uint8Array for WebAuthn API
            options.publicKey.challenge = base64urlToUint8Array(options.publicKey.challenge);
            if (options.publicKey.allowCredentials) {
                options.publicKey.allowCredentials.forEach(cred => {
                    cred.id = base64urlToUint8Array(cred.id);
                });
            }

            // Step 2: Request authentication (assertion) from the browser using WebAuthn API
            const credential = await navigator.credentials.get({
                publicKey: options.publicKey
            });

            // Step 3: Send the generated authentication response to your server for verification
            const assertionResponse = {
                id: credential.id,
                rawId: uint8ToBase64url(new Uint8Array(credential.rawId)),
                response: {
                    clientDataJSON: uint8ToBase64url(new Uint8Array(credential.response.clientDataJSON)),
                    authenticatorData: uint8ToBase64url(new Uint8Array(credential.response.authenticatorData)),
                    signature: uint8ToBase64url(new Uint8Array(credential.response.signature)),
                    userHandle: credential.response.userHandle ? uint8ToBase64url(new Uint8Array(credential.response.userHandle)) : null,
                },
                type: credential.type
            };

            const verifyResponse = await fetch('/api/login/finish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(assertionResponse)
            });

            const result = await verifyResponse.json();
            if (result.success) {
                updateStatus('Successfully logged in!', 'success');
                // Redirect user to dashboard or next page on successful login
                // window.location.href = '/dashboard';
            } else {
                updateStatus('Login failed: ' + (result.message || 'Unknown error occurred.'), 'error');
            }

        } catch (error) {
            console.error('Passkey login error:', error);
            updateStatus('Passkey login cancelled or an error occurred. Please try with password.', 'error');
            // Suggest trying with password if Passkey fails or is cancelled
        }
    }

    // Event listener for Passkey Login Button
    loginPasskeyBtn.addEventListener('click', () => {
        const username = usernameEmailInput.value.trim();
        loginWithPasskey(username); // Attempt passkey login, even if username is empty (for discoverable credentials)
    });

    // Event listener for Password Login Button (standard login)
    loginPasswordBtn.addEventListener('click', async () => {
        const username = usernameEmailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            updateStatus('Please enter your username/email and password.', 'error');
            return;
        }

        updateStatus('Logging in with password...', 'info');

        try {
            // Make a real API call to your backend for password verification
            const response = await fetch('/api/login/password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();
            if (response.ok && result.success) {
                updateStatus('Successfully logged in with password!', 'success');
                // Redirect on successful password login
                // window.location.href = '/dashboard';
            } else {
                updateStatus('Login failed: ' + (result.message || 'Invalid username or password.'), 'error');
            }
        } catch (error) {
            console.error('Password login error:', error);
            updateStatus('An error occurred during password login.', 'error');
        }
    });
});