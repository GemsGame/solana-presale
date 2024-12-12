import { createTheme } from "@mui/material";
import { red } from "@mui/material/colors";

export const theme = createTheme({
    palette: {
        primary: {
            main: '#a050ff'
        }
    },
    typography: {
        fontFamily: 'Montserrat',
    },

    shape: {
        borderRadius: 15
    },

    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none'
                }
            }
        },
        MuiFilledInput: {

     
            styleOverrides: {
                root: {
                    fontWeight: '100px'
                }
            }
          
        }
    }
})