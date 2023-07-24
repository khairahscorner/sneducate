# Fonts

## Setup 

#### Best Practice 1

Import from a cdn url if avaliable online in index.css file.

```css

@import url('https://fonts.googleapis.com/css?family=DM+Sans:400,500,700&display=swap');

```

#### Best Practice 2

Add local font file to the font folder and import in index.css file

```css

@font-face {
  font-family: 'Avenir' ;
  src: url("./assets/fonts/Avenir.ttc") format("truetype");
}

```

---

## Usage 

```css

* {
  box-sizing: border-box;
  font-family: 'Avenir',sans-serif;
}

input,textarea,select {
  font-family: 'Avenir',sans-serif;
}

```