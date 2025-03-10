import './App.css';
import React, { useState } from 'react';

function App() {
  const [reactNativeCode, setReactNativeCode] = useState('');
  const [reactJsCode, setReactJsCode] = useState('');
  const [cssCode, setCssCode] = useState('');

  const handleConvert = () => {
    let convertedCode = reactNativeCode;
    let convertedCss = '';
    
    convertedCode = convertedCode.replace(/import {[^}]+} from 'react-native';/g, '');
    


    // Ensure the import React statement is added once at the beginning
    if (!convertedCode.includes("import React from 'react';")) {
      convertedCode = "import React from 'react';\n" + convertedCode;
    }

    // Replace React Native components with their React.js equivalents
    convertedCode = convertedCode
      .replace(/View/g, 'div')
      .replace(/Text/g, 'p')
      .replace(/TouchableOpacity/g, 'button')
      .replace(/StyleSheet.create\({(.*?)}\)/gs, '');

    // Extract and convert the styles to CSS
    const styleRegex = /const styles = StyleSheet.create\(({[\s\S]*?})\);/g;
    const styleMatch = styleRegex.exec(reactNativeCode);

    if (styleMatch) {
      const stylesObject = eval(`(${styleMatch[1]})`);
      for (const [key, value] of Object.entries(stylesObject)) {
        const cssClassName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        convertedCss += `.${cssClassName} {\n`;
        for (const [cssKey, cssValue] of Object.entries(value)) {
          const cssProperty = cssKey.replace(/([A-Z])/g, '-$1').toLowerCase();
          convertedCss += `  ${cssProperty}: ${cssValue};\n`;
        }
        convertedCss += '}\n\n';
      }

       // Replace style={styles.someClass} with className="someClass"
       convertedCode = convertedCode.replace(/style={styles\.(\w+)}/g, (match, p1) => {
        return `className="${p1}"`;
      });
      
    }

    // Remove the entire StyleSheet creation
    convertedCode = convertedCode.replace(/const styles = ;/g, '');

    // Update the state with the converted code and CSS
    setReactJsCode(convertedCode);
    setCssCode(convertedCss);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>React Native to React.js Converter</h2>
      <textarea
        rows="10"
        cols="50"
        value={reactNativeCode}
        onChange={(e) => setReactNativeCode(e.target.value)}
        placeholder="Paste your React Native code here"
        style={{ width: '100%', marginBottom: '10px' }}
      />
      <button onClick={handleConvert} style={{ padding: '10px 20px' }}>
        Convert to React.js
      </button>
      <h3>Converted React.js Code:</h3>
      <pre
        style={{
          backgroundColor: '#f0f0f0',
          padding: '10px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {reactJsCode}
      </pre>
      <h3>Generated CSS:</h3>
      <pre
        style={{
          backgroundColor: '#f0f0f0',
          padding: '10px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {cssCode}
      </pre>
    </div>
  );
}

export default App;
