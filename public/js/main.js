// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Auto-dismiss alerts after 5 seconds
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach(alert => {
    setTimeout(() => {
      const bsAlert = new bootstrap.Alert(alert);
      bsAlert.close();
    }, 5000);
  });

  // Add confirmation to delete buttons
  const deleteButtons = document.querySelectorAll('.btn-danger[type="submit"]');
  deleteButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      if (!confirm('Are you sure you want to delete this item?')) {
        e.preventDefault();
      }
    });
  });
});