function scheduleEmail() {
    const subject = document.getElementById('subject').value;
    const body = document.getElementById('body').value;
    const recipients = document.getElementById('recipients').value.split(',').map(email => email.trim());
    const schedule = new Date(document.getElementById('schedule').value);
  
    const payload = { subject, body, recipients, schedule };
  
    fetch('http://localhost:3000/schedule-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          alert(data.message);
        })
        .catch(error => {
          console.error('Error during fetch:', error);
          alert('An error occurred. Please check the console for more details.');
        });
      
  }
  