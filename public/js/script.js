(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.validated-form')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()





document.addEventListener('DOMContentLoaded', () => {
  const flashMessages = document.querySelectorAll('.alert'); // Select ALL alerts

  flashMessages.forEach(flashMessage => {  // Loop through all alerts
    setTimeout(() => {
      // Option 1: Hide the element (using Bootstrap's fade class for smooth transition)
      flashMessage.classList.remove('show'); // Remove the 'show' class to trigger fade out
      setTimeout(() => { // Remove from DOM after transition
        flashMessage.remove();
      }, 600); // Adjust timeout to match your fade-out duration

      // Option 2: Remove the element immediately
      // flashMessage.remove(); 

    }, 5000); // 5 seconds
  });
});
