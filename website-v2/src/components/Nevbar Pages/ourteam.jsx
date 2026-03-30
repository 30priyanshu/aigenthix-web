import React from 'react';
import SEO from "../SEO";


const ourteam = () => {
    // --- Theme Colors from your Navbar/Hero Section ---
    const PRIMARY_DARK_BLUE = '#011A41'; // Deep Navy background
    const ACCENT_BLUE = '#2D4DE8';      // Contact Us button / Accent color
    const TEXT_COLOR = '#1a1a1a';       // Dark text for headings
    const SUBTITLE_COLOR = '#666666';   // Standard subtitle gray
    
    // --- Animation Keyframes ---
    const fadeIn = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;

    try {
        const styleSheet = document.styleSheets[0];
        const rules = Array.from(styleSheet.cssRules).map(rule => rule.cssText);
        if (!rules.some(rule => rule.includes('@keyframes fadeIn'))) {
            styleSheet.insertRule(fadeIn, styleSheet.cssRules.length);
        }
    } catch (e) {
        console.warn("Animation keyframes insertion failed.", e);
    }
    
    // --- Component Styles (Using the new color palette) ---
    
    // Main Container Style: Adjusted for modern theme
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: '100vh',
        padding: '80px 20px',
        backgroundColor: '#ffffff', // Keeping the background white for the form area
        fontFamily: 'serif',
    };

    // Main Heading Style: Animated, large, bold serif font
    const titleStyle = {
        fontSize: '42px',
        fontWeight: 'bold',
        fontFamily: 'serif',
        color: TEXT_COLOR,
        marginBottom: '20px',
        opacity: 0,
        animation: 'fadeIn 0.8s ease-out 0s forwards',
    };

    // Subtitle Style: Animated, centered, lighter text
    const subtitleStyle = {
        fontSize: '16px',
        color: SUBTITLE_COLOR,
        textAlign: 'center',
        maxWidth: '450px',
        marginBottom: '40px',
        lineHeight: '1.6',
        opacity: 0,
        animation: 'fadeIn 0.8s ease-out 0.2s forwards',
    };

    // Form Container Style
    const formContainerStyle = {
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        opacity: 0,
        animation: 'fadeIn 0.8s ease-out 0.4s forwards',
    };

    // Input Field Wrapper Style: Clean, slightly rounded edges
    const inputWrapperStyle = {
        backgroundColor: 'white',
        border: '1px solid #dcdcdc',
        borderRadius: '6px',
        marginBottom: '20px',
        padding: '12px 15px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
        transition: 'border-color 0.3s',
    };
    
    // Input Element Style
    const inputStyle = {
        width: '100%',
        border: 'none',
        outline: 'none',
        fontSize: '16px',
        color: TEXT_COLOR,
        backgroundColor: 'transparent',
    };

    // Primary Button Style: Using website's ACCENT_BLUE for high contrast and elegance
    const buttonStyle = {
        backgroundColor: ACCENT_BLUE, 
        color: 'white',
        border: 'none',
        borderRadius: '25px',
        padding: '12px 30px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '10px',
        marginBottom: '20px',
        textTransform: 'uppercase',
        transition: 'all 0.3s ease-in-out',
        boxShadow: `0 4px 10px ${ACCENT_BLUE}40`,
    };

    // Link Style: Subtle gray text
    const linkStyle = {
        color: SUBTITLE_COLOR,
        fontSize: '15px',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'color 0.3s',
    };
    
    // Emphasis Link Style (for "Create account" link)
    const emphasisLinkStyle = {
        color: TEXT_COLOR, 
        fontWeight: '700',
        textDecoration: 'underline',
    };
    
    // --- Hover Handlers for Attractive Interaction ---
    const handleButtonHover = (e, isHovering) => {
        e.target.style.backgroundColor = isHovering ? '#1a39d1' : ACCENT_BLUE;
        e.target.style.boxShadow = isHovering ? `0 6px 15px ${ACCENT_BLUE}60` : `0 4px 10px ${ACCENT_BLUE}40`;
    };
    
    const handleInputFocus = (e, isFocused) => {
        e.target.parentNode.style.border = isFocused ? `1px solid ${ACCENT_BLUE}` : '1px solid #dcdcdc';
    };


    return (
    <>
        <SEO
            title="Team"
            description="Learn about AiGenthix — our mission, vision, AI research, ethical approach, and how we help businesses grow using cutting-edge artificial intelligence."
        />
        <div style={containerStyle}>
            <h1 style={titleStyle}>Account sign in</h1>
            
            <p style={subtitleStyle}>
                Sign in to your account to access your profile, history, and any private pages you've been granted access to.
            </p>

            <div style={formContainerStyle}>
                
                {/* Email Input */}
                <div style={inputWrapperStyle}>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        style={inputStyle}
                        aria-label="Email"
                        onFocus={(e) => handleInputFocus(e, true)}
                        onBlur={(e) => handleInputFocus(e, false)}
                    />
                </div>
                
                {/* Password Input */}
                <div style={inputWrapperStyle}>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        style={inputStyle}
                        aria-label="Password"
                        onFocus={(e) => handleInputFocus(e, true)}
                        onBlur={(e) => handleInputFocus(e, false)}
                    />
                </div>

                {/* Sign In Button */}
                <button 
                    style={buttonStyle}
                    onMouseEnter={(e) => handleButtonHover(e, true)}
                    onMouseLeave={(e) => handleButtonHover(e, false)}
                >
                    Sign In
                </button>
                
                {/* Reset Password Link */}
                <a 
                    href="#" 
                    style={{ ...linkStyle, textAlign: 'center', marginBottom: '40px' }}
                    onMouseEnter={(e) => e.target.style.color = TEXT_COLOR}
                    onMouseLeave={(e) => e.target.style.color = SUBTITLE_COLOR}
                >
                    Reset password
                </a>
                
                {/* Not a member? Create account. */}
                <p style={{ ...linkStyle, textAlign: 'center' }}>
                    Not a member? {' '}
                    <a 
                        href="#" 
                        style={emphasisLinkStyle}
                        onMouseEnter={(e) => e.target.style.color = ACCENT_BLUE}
                        onMouseLeave={(e) => e.target.style.color = TEXT_COLOR}
                    >
                        Create account.
                    </a>
                </p>
            </div>
        </div>
        </>
    );
};

export default ourteam;