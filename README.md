# GhostGPT

GhostGPT is a fun, experimental chatbot with a ghostly personality that interacts differently based on the time of day. During "haunting hours" (9 PM to 3 AM), the chatbot becomes more lively and eerie, sometimes even vanishing mid-conversation with glitch effects! This project is created purely for fun and non-commercial purposes.

## Features

- **Haunting Hours Mode:** The chatbot springs to life between 9 PM and 3 AM with extra ghostly responses.
- **Vanishing Act:** Occasionally, the ghost “fades into the void” with glitch effects and then reappears.
- **Animated UI:** Enjoy a dynamic, animated background powered by `react-tsparticles` that sets an eerie atmosphere.
- **Glitch Effects:** Ghost messages may display glitch animations for an added touch of spookiness.
- **Easter Egg:** Clicking on a ghost message reveals a secret chamber of spirits!
- **Responsive Design:** Fully responsive layout for an engaging experience on both desktop and mobile devices.

## Demo

Check out the live demo on GitHub Pages:  
[GhostGPT Live Demo](https://sambhav-gautam.github.io/ghostGPT)

## Installation & Running Locally

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Sambhav-Gautam/ghostGPT.git
   ```

2. **Change into the project directory:**

   ```bash
   cd ghostGPT
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Start the development server:**

   ```bash
   npm start
   ```

   Then, open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## Deployment

This project is deployed using GitHub Pages. To deploy your changes:

1. **Build the project:**

   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages:**

   ```bash
   npm run deploy
   ```

   Make sure your `package.json` includes a `homepage` field set as follows:

   ```json
   "homepage": "https://sambhav-gautam.github.io/ghostGPT"
   ```

## Usage

- **Chat Interaction:**  
  Type your message in the input field and press Enter or click the Send button.
  
- **Ghost Responses:**  
  The chatbot responds with varying messages depending on whether it’s haunting hours or not. If the ghost vanishes, wait a few seconds for it to reappear.

- **Easter Egg:**  
  Clicking on a ghost message triggers a secret Easter egg message.

## Disclaimer

**This project is made for fun and non-commercial purposes only.**  
It is intended solely for educational and entertainment purposes and is provided "as is" without any warranty.

## Contributing

Contributions are welcome! Feel free to fork the repository, make improvements, and submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the creators of [react-tsparticles](https://www.npmjs.com/package/react-tsparticles), [Animate.css](https://animate.style/), and [Day.js](https://day.js.org/) for their fantastic libraries.
- Special thanks to the open-source community for continuous inspiration.
