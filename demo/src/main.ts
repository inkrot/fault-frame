/**
 * FaultFrame Demo - Interactive error testing
 */

import axios from 'axios';
import { FaultFrame, createFetchWithFaultFrame } from 'fault-frame';

// Initialize FaultFrame with Symfony framework
FaultFrame.init({
  framework: 'symfony',
  axiosInstance: axios,
  enabled: true,
  toastPosition: 'bottom-right',
  toastDuration: 10000,
  // ignoreStatusCodes: [404], // Uncomment to ignore 404 errors
});

// Create Fetch wrapper
const fetchWithErrors = createFetchWithFaultFrame(FaultFrame.getInstance());

// API URL from environment variable or fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

console.log('🌐 API URL:', API_URL);

// Helper to show spinner in button
function showSpinner(button: HTMLElement) {
  button.setAttribute('data-original-text', button.textContent || '');
  button.setAttribute('disabled', 'true');
  const spinner = document.createElement('div');
  spinner.className = 'spinner';
  button.innerHTML = '';
  button.appendChild(spinner);
  const text = document.createTextNode(' Loading...');
  button.appendChild(text);
}

// Helper to hide spinner and restore button
function hideSpinner(button: HTMLElement) {
  const originalText = button.getAttribute('data-original-text') || '';
  button.removeAttribute('disabled');
  button.innerHTML = originalText;
}

// Wrapper for async button click handlers
async function handleButtonClick(buttonId: string, asyncFn: () => Promise<void>) {
  const button = document.getElementById(buttonId);
  if (!button) return;

  button.addEventListener('click', async () => {
    showSpinner(button);
    try {
      await asyncFn();
    } finally {
      hideSpinner(button);
    }
  });
}

// Button handlers
handleButtonClick('trigger-500', async () => {
  console.log('Triggering 500 error...');
  try {
    await axios.get(`${API_URL}/error-500.php`);
  } catch (error) {
    console.error('Expected error:', error);
  }
});

handleButtonClick('trigger-400', async () => {
  console.log('Triggering 400 error...');
  try {
    await axios.post(`${API_URL}/error-400.php`, {
      name: '',
      email: 'invalid-email',
    });
  } catch (error) {
    console.error('Expected error:', error);
  }
});

handleButtonClick('trigger-404', async () => {
  console.log('Triggering 404 error...');
  try {
    await axios.get(`${API_URL}/error-404.php`);
  } catch (error) {
    console.error('Expected error:', error);
  }
});

handleButtonClick('trigger-network', async () => {
  console.log('Triggering network error...');
  try {
    // Invalid domain to trigger network error
    await axios.get('https://this-domain-does-not-exist-12345.com/api/test', {
      timeout: 3000,
    });
  } catch (error) {
    console.error('Expected error:', error);
  }
});

handleButtonClick('trigger-fetch', async () => {
  console.log('Triggering Fetch 500 error...');
  try {
    const response = await fetchWithErrors(`${API_URL}/error-500.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        test: 'data',
      }),
    });

    console.log('Response:', response);
  } catch (error) {
    console.error('Expected error:', error);
  }
});

console.log('✅ FaultFrame Demo loaded!');
console.log('Click any button to test error handling');
