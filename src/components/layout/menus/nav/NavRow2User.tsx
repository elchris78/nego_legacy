import {
    AppBar,
    Box,
    Button,
    IconButton,
    styled,
  } from "@mui/material"
  import MenuIcon from "@mui/icons-material/Menu"
  import CloseIcon from "@mui/icons-material/Close"
  import Link from "next/link"
  import { useState } from "react"
  import { usePathname } from "next/navigation"
  import Cookies from "js-cookie"
  
  interface ButtonProps {
    label: string
    route: string
    imgSrc?: string
  }
  
  interface NavFila2Props {
    tabs: ButtonProps[]
    companiesL: number | undefined
  }

  const StyledAppBar = styled(AppBar)({
    backgroundColor: 'white',
    boxShadow: 'none',
    height: 'auto',
    marginTop: 0,
  });
  
  export default function NavFila2({ tabs, companiesL }: NavFila2Props) {
    const [isMenuOpen, setMenuOpen] = useState(false)
    const pathname = usePathname()
  
    const handleMenuToggle = () => {
      setMenuOpen(!isMenuOpen)
    }
  
    const shouldFullWidth = companiesL && companiesL > 1
  
    return (
      <StyledAppBar position="static" sx={{ height: 'auto', marginTop: 0 }}>
        <Box
          sx={{
            backgroundColor: '#5B6670',
            padding: 0,
            minHeight: 'unset',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px'
          }}
        >
          <IconButton
            edge="start"
            onClick={handleMenuToggle}
            sx={{
              display: { xs: 'flex', lg: 'none' },
              color: 'white',
              padding: '8px',
              ml: {xs: 2.5, md: 0}
            }}
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
  
          <Box
            sx={{
              display: { xs: isMenuOpen ? 'flex' : 'none', lg: 'flex' },
              flexDirection: { xs: 'column', md: shouldFullWidth ? 'column' : 'row' },
              alignItems: 'stretch',
              width: '100%',
              justifyContent: 'center',
              height: 'auto',
              padding: 0
            }}
          >
            {tabs.map((tab, index) => (
              <Link 
                key={index} 
                href={tab.route} 
                passHref
                style={{ 
                  width: '100%',
                  display: 'flex',
                  backgroundColor:'#202945'
                }}
              > 
                <Button
                  fullWidth
                  sx={{
                    textTransform: 'none',
                    color: 'white',
                    px: 3,
                    py: 1,
                    padding: '8px 16px',
                    borderRadius: "none",
                    backgroundColor:
                      pathname === tab.route || (pathname === '/admin/home' && tab.route === '/admin')
                        ? '#202945'
                        : 'transparent',
                    '&:hover': {
                      backgroundColor: '#202945',
                    },
                    margin: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderTopLeftRadius: index === 0 ? '16px' : 0
                  }}
                >
                  {tab.label}
                </Button>
              </Link>
            ))}
          </Box>
        </Box>
      </StyledAppBar>
    )
  }
  
  