import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';
import CssBaseline from '@material-ui/core/CssBaseline';

const themes = {
  default: createMuiTheme({
    palette: {
      primary: {
        light: blue[300],
        main: blue[500],
        dark: blue[700],
      },
      secondary: {
        light: red[300],
        main: red[500],
        dark: red[700],
      },
    },
  }),
  studio: createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            light: blue[300],
            main: blue[500],
            dark: blue[700],
        },
        secondary: {
            light: red[300],
            main: red[500],
            dark: red[700],
        },
    }
  })
};

function withRoot(Component, overrideTheme) {
  function WithRoot(props) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    const selectedTheme = themes[overrideTheme] || themes.default;
    return (
      <MuiThemeProvider theme={selectedTheme}>
        <CssBaseline />
        <Component {...props} />
      </MuiThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;