// This script configures Tailwind CSS to use custom colors
// and should be loaded after the Tailwind CDN script.

tailwind.config = {
    theme: {
        extend: {
            colors: {
                // Custom colors used in the index.html file
                'primary-accent': '#0056B3', /* Professional Dark Blue */
                'secondary-light': '#F0F9FF', /* Very Light Blue for background contrast */
            }
        }
    }
}

