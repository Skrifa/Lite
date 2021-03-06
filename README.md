# Skrifa Lite

A note taking app focused on simplicity. Skrifa Lite ships with all the functionality of the Skrifa app but strips away the encryption features, providing a blazing fast experience for those who are not interested on encrypting their notes or need a lighter option for a low-spec hardware.

From school to your office, Skrifa is the word processor for everyone.

With a minimal, distraction free, simple and yet powerful interface, it's focused on what you really care, your content. It is so versatile that you'll have no problem using it for any scenario, as a power user or just as a simple quick note taking app.

From text styling to videos and images, and there are also features for more specific things like **writing code, math and data tables**

### Writing Math
Having a suitable notebook for any ocation is something we all need, Skrifa has Mathjax capabilities so that you can write math formulas and some LaTEX code, ideal for students and people who work with math! Doing it is as simple as just typing your formula like this:
$x + y = z$

### Writing Code
Thanks to Prism.js Skrifa also has code highlightning for you!

## Contributing
There are several ways you can contribute to the development of Skrifa and Skrifa Lite

### Creating a new Theme
Creating a new CSS theme is incredibly easy! All you have to do is copy the `theme-template.css` file into a file with your theme's name inside the themes directory.
This file already has a lot of the common elements you'll need to style in order to create a functional theme, once you've copied the file, the next step is to rename the theme class to your theme's name, using a find and replace all utility is pretty useful!

To load your theme, you'll need to add the stylesheet link in the `index.html` file as well as adding the option in the select element inside the settings view, remember the value of the select must match the class name of your theme!

### Adding functionality
Skrifa is very extensible and you can add all kinds of functionality, from utilities for the editor to new export formats or encryption features. You may know Skrifa is divided in views or screens, each view has a javascript file that contains all it's functionality.

If you want to add a new view, you'll need to create it inside the `index.html` file and add a javascript file for it's functionality.

### Reporting a Bug
If you've found an error please report it so it can be fixed, describe the error and what you were doing while it happened.

### Buying Skrifa
Skrifa is a pay-what-you-want software, every time someone pays for skrifa, the payment will be split 50/50 between the developers and donations for the projects Skrifa uses.

### Supporting via Patreon
You can support me via [Patreon](https://www.patreon.com/Hyuchia), by supporting me via patreon you are not only contributing to this project but also all my other projects and contributions!

### Fixing a Bug
If you've found a bug and you are willing to fix it, just clone this repository, fix the bug and make a Pull Request, your code will be evaluated and then merged to the main branch, it really is simple to contribute!

## License
Skrifa is released under the [GPLv3.0 License](https://github.com/Skrifa/License/blob/master/LICENSE)