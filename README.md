# Emotional Quotes Generator

Welcome to the Emotional Quotes Generator project! This Ionic-based application combines the power of facial emotion analysis with Google Cloud API and a quotes API to create personalized and emotionally relevant quotes overlaid on beautiful images sourced from Pexels.

## Features

- **Emotional Analysis:** The app captures a photo of the user's face and utilizes the Google Cloud Vision API to analyze facial expressions and emotions.
- **Quotes API Integration:** Based on the emotional analysis, the app fetches emotionally relevant quotes from a quotes API.
- **Image Overlay:** The application fetches captivating images from Pexels and overlays the selected quote onto the image.
- **Download and Share:** Users can download the personalized image with the overlaid quote and share it on social media.

## Getting Started

To run this project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/emotional-quotes.git
   ```

2. Install dependencies:

   ```bash
   cd emotional-quotes
   npm install
   ```

3. Run the app:

   ```bash
   ionic serve
   ```

   This will start a local development server. Open your browser and navigate to [http://localhost:8100/](http://localhost:8100/) to see the app in action.

## Configuration

To use the Google Cloud Vision API, obtain API credentials and replace the placeholder in `src/app/services/google-cloud-vision.service.ts` with your credentials.

Similarly, configure the quotes API and Pexels API in the respective service files.

## Dependencies

- Ionic Framework
- Google Cloud Vision API
- Quotes API
- Pexels API

## Contributing

We welcome contributions! If you find any issues or have ideas for improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute the code.

Happy generating emotional quotes! 🌈✨
