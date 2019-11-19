//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require("eslint");
const rule = require("../../../lib/rules/no-string-literal");

const parsers = require("../../helpers/parsers");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ERROR_MESSAGE = "String literal not allowed";

const ruleTester = new RuleTester({ parser: parsers.BABEL_ESLINT });
ruleTester.run("no-string-literal", rule, {
  valid: [
    {
      code: "import React from 'react';"
    },
    {
      code: "import { useState } from 'react';"
    },
    {
      code: "import { Component as ReactComponent } from 'react';"
    },
    {
      code: "import * as settings from 'settings';"
    },
    {
      code: "import('/modules/my-module.js').then(() => {});"
    },
    {
      code: "export { Settings } from './Settings';"
    },
    {
      code: "export { DefaultSettings as Settings } from './Settings';"
    },
    {
      code: "export * from './Settings';"
    },
    {
      code: "const React = require('react');"
    },
    {
      code: "const id = document.getElementById('root');"
    },
    {
      code: "const elements = document.getElementsByClassName('white');"
    },
    {
      code: "const elements = document.getElementsByClassName(`${color}-dark`);"
    },
    {
      code: "const item = localStorage.getItem('userId');"
    },
    {
      code: "localStorage.setItem('userId', '123');"
    },
    {
      code:
        "const date = new Intl.DateTimeFormat('en_US', { day: 'numeric', month: 'numeric' }).format(date);"
    },
    {
      code: "const isMobile = name.includes('iOS');"
    },
    {
      code: "window.postMessage(`Error: ${message}`, '*');"
    },
    {
      code: "window.addEventListener('keydown', handleKeyDown);"
    },
    {
      code: "window.removeEventListener('keydown', handleKeyDown);"
    },
    {
      code: [
        "gql`query GetUser($userId: String!) {",
        "  user(id: $userId) {",
        "    id",
        "    name",
        "  }",
        "}`"
      ].join("\n"),
      options: [
        {
          ignoreFunctions: ["gql"]
        }
      ]
    },
    {
      code: "const message = '';"
    },
    {
      code: "const message = messages['error-status'];"
    },
    {
      code: "const message = messages[`${status}-color`];"
    },
    {
      code: "const messages = { ['error-status']: value };"
    },
    {
      code: "const messages = { [`${status}-status`]: value };"
    },
    {
      code: "const FOO = 'BAR';"
    },
    {
      code: "const FOO = { fooo: 'BAR' };"
    },
    {
      code: "const NON_DISPLAY_FOO = 'bar';"
    },
    {
      code:
        "const httpUrls = ['https://github.com', 'http://www.github.com', 'http://localhost:3000', `https://website.com/${path}`];"
    },
    {
      code:
        "const otherUrls = ['mailto:me@example.com', 'tel:9999999999', 'file://some/path', '//github.com'];"
    },
    {
      code:
        "const options = { key: `row-${id}`, id: '321321', fetchPolicy: 'cache-and-network', path: { github: '/pulls' } };",
      options: [
        {
          ignoreObjectKeys: ["fetchPolicy", "path"]
        }
      ]
    },
    {
      code: "const success = status !== 'error';"
    },
    {
      code: "const success = status === `server-${status}`;"
    },
    {
      code: "if (condition === 'some_string') return true;"
    },
    {
      code: "const message = status === 'error' ? error : success;"
    },
    {
      code: "const message = t('Hi there!');"
    },
    {
      code: "const message = `${number}`;"
    },
    {
      code:
        "<Trans i18nKey='someKey'><div>Some <strong>text</strong></div></Trans>"
    },
    {
      code: "<p>{get(obj, `details.count`) || 0}</p>",
      options: [
        {
          ignoreFunctions: ["get"]
        }
      ]
    },
    {
      code: "const message = someFunction.translate('Hi there!');",
      options: [
        {
          ignoreFunctions: ["translate"]
        }
      ]
    },
    {
      code: "const message = i18next.t('Hi there!');",
      options: [
        {
          ignoreFunctionsOnObjects: [{ objects: ["i18next"], functions: ["t"] }]
        }
      ]
    },
    {
      code: "const message = i18next.t(format('Hi there!'));",
      options: [
        {
          ignoreFunctionsOnObjects: [{ objects: ["i18next"], functions: ["t"] }]
        }
      ]
    },
    {
      code:
        "reporter.track('Event name', { Success: false, 'Error key': errorKey || 'Unknown' });",
      options: [
        {
          ignoreFunctionsOnObjects: [
            { objects: ["reporter"], functions: ["track"] }
          ]
        }
      ]
    },
    {
      code:
        "reporter.error.client.notify({ name: 'Failed', message: `Error: ${error.message}` }, { severity: 'warning' } );",
      options: [
        {
          ignoreFunctionsOnObjects: [
            { objects: ["client"], functions: ["notify"] }
          ]
        }
      ]
    },
    {
      code: "PATHS.report('spend');",
      options: [
        {
          ignoreFunctionsOnObjects: [{ objects: ["PATHS"] }]
        }
      ]
    },
    {
      code: [
        "switch(type) {",
        "  case 'success':",
        "    return true;",
        "  case 'error':",
        "    return false;",
        "  default:",
        "    return null;",
        "}"
      ].join("\n")
    },
    {
      code: [
        "class SomeComponent extends React.Component {",
        "  static displayName = 'SomeComponent';",
        "  render() {",
        "    return <div />;",
        "  }",
        "}"
      ].join("\n")
    },
    {
      code: [
        "class SomeComponent extends React.Component {",
        "  render() {",
        "    return <div />;",
        "  }",
        "}",
        "SomeComponent.displayName = 'SomeComponent';"
      ].join("\n")
    },
    {
      code: [
        "class SomeComponent extends React.Component {",
        "  static user = { firstName: '', lastName: '' };",
        "  render() {",
        "    return <div />;",
        "  }",
        "}"
      ].join("\n")
    },
    {
      code: [
        "const ErrorComponent = () => <div />;",
        "ErrorComponent.displayName = 'SomeComponent';"
      ].join("\n")
    },
    {
      code: "<div id='some-div' className='white' />"
    },
    {
      code:
        "<SomeComponent containerClassName='white' contentStyle={{ color: 'white' }} />"
    },
    {
      code:
        "<a href='https:://github.com' target='_blank' rel='noreferrer noopener'>{t('text')}</a>"
    },
    {
      code: "<button type='button' for='form-id' />"
    },
    {
      code:
        "<input type='email' id='email' name='email' autoComplete='off' value={t('email@email.com')} />"
    },
    {
      code:
        "<label for='email'><input type='email' id='email' name='email' /></label>"
    },
    {
      code: [
        "<select name='pets' id='pet-select'>",
        "  <option value=''></option>",
        "  <option value='dog' selected>{t('Dog')}</option>",
        "  <option value='cat'>{t('Cat')}</option>",
        "</select>"
      ].join("\n"),
      options: [
        {
          ignoreFunctions: ["t"]
        }
      ]
    },
    {
      code:
        "<textarea id='feedback' name='feedback' rows='5' cols='40' minLength='50' maxLength='1000' />"
    },
    {
      code: "<img src='./image.png' />"
    },
    {
      code: "<div id='some-id' tabIndex='0' aria-labelledby='label-id'></div>"
    },
    {
      code: "<div style='color: white' />"
    },
    {
      code:
        "{list.map(l => <ListItem key={`${get(obj, 'details[0].label')}`} />)}",
      options: [
        {
          ignoreFunctions: ["get"]
        }
      ]
    },
    {
      code: "{list.map(l => <Fragment key={`item-${l.id}`}><div /></Fragment>)}"
    },
    {
      code: "<Div key={`item-${l.id}`} />"
    },
    {
      code: "<Div key='item-1' />"
    },
    {
      code:
        "<iframe src='https://google.com' width='100%' height='200' id='google' scrolling='no' />"
    },
    {
      code: "<Icon name='Chevron' />",
      options: [
        {
          ignoreAttributesOnElements: [
            { elements: ["Icon"], attributes: ["name"] }
          ]
        }
      ]
    },
    {
      code: "<Icon name='Chevron' />",
      options: [
        {
          ignoreAttributes: ["name"]
        }
      ]
    },
    {
      code: "<MyButton id='some-button' />"
    },
    {
      code: "<MyButton type='button' for='form-id' />",
      options: [
        {
          buttonComponents: ["MyButton"]
        }
      ]
    },
    {
      code:
        "<SomeCustomInput type='email' id='email' name='email' autoComplete='off' />",
      options: [
        {
          inputComponents: ["SomeCustomInput"]
        }
      ]
    },
    {
      code: "<Link target='blank' rel='noreferrer noopener' />",
      options: [
        {
          linkComponents: ["Link"]
        }
      ]
    },
    {
      code: [
        "<svg width='1300px' height='383px' viewBox='0 0 1300 383' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>",
        "  <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>",
        "    <g id='chevron' stroke='#000000' transform='translate(1.000000, 0.000000)' strokeWidth='1.5'>",
        "      <polyline points='0 0.698834 4.025585 4.724419 8.05117 0.698834' />",
        "    </g>",
        "  </g>",
        "</svg>"
      ].join("\n")
    },
    {
      code:
        "<path d='M4.74 1.44a.65.65 0 0 1 .92.92l-2.2 2.2a.65.65 0 0 1-.92 0l-2.2-2.2a.65.65 0 0 1 .92-.92L3 3.18l1.74-1.74z' fill='#000000' fillRule='nonzero' />"
    }
  ],

  invalid: [
    {
      code: "const message = 'Hello there!';",
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 17,
          type: "Literal"
        }
      ]
    },
    {
      code: "const MESSAGE = 'Hello there!';",
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 17,
          type: "Literal"
        }
      ]
    },
    {
      code: "const message = 'Hello ' +  'there!';",
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 17,
          type: "Literal"
        },
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 29,
          type: "Literal"
        }
      ]
    },
    {
      code: "const message = `Hello ${name}!`;",
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 17,
          type: "TemplateLiteral"
        }
      ]
    },
    {
      code: "const user = { firstName: 'first', lastName: 'last' };",
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 27,
          type: "Literal"
        },
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 46,
          type: "Literal"
        }
      ]
    },
    {
      code:
        "const options = { fetchPolicy: 'cache-and-network', url: { github: 'https://github.com' } };",
      options: [
        {
          ignoreObjectKeys: ["url"]
        }
      ],
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 32,
          type: "Literal"
        }
      ]
    },
    {
      code: [
        "switch(type) {",
        "  case 'success':",
        "    return 'This is a success';",
        "  case 'error':",
        "    return 'This is a failure';",
        "  default:",
        "    return 'Not sure what this is';",
        "}"
      ].join("\n"),
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 3,
          column: 12,
          type: "Literal"
        },
        {
          message: ERROR_MESSAGE,
          line: 5,
          column: 12,
          type: "Literal"
        },
        {
          message: ERROR_MESSAGE,
          line: 7,
          column: 12,
          type: "Literal"
        }
      ]
    },
    {
      code: "const message = i18next.t('Hi there!');",
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 27,
          type: "Literal"
        }
      ]
    },
    {
      code: "const message = i18next.t('Hi there!');",
      options: [
        {
          ignoreFunctionsOnObjects: [
            { objects: ["i18next"], functions: ["trans"] },
            { objects: ["somethingElse"], functions: ["t"] }
          ]
        }
      ],
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 27,
          type: "Literal"
        }
      ]
    },
    {
      code: ["let message = '';", "message = `Hi ${name}!`;"].join("\n"),
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 2,
          column: 11,
          type: "TemplateLiteral"
        }
      ]
    },
    {
      code: "const message = `${number}${letter}`;",
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 17,
          type: "TemplateLiteral"
        }
      ]
    },
    {
      code: [
        "class SomeComponent extends React.Component {",
        "  static tabs = ['Home', 'Profile'];",
        "  render() {",
        "    return <div />;",
        "  }",
        "}"
      ].join("\n"),
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 2,
          column: 18,
          type: "Literal"
        },
        {
          message: ERROR_MESSAGE,
          line: 2,
          column: 26,
          type: "Literal"
        }
      ]
    },
    {
      code: [
        "class SomeComponent extends React.Component {",
        "  static config = { header: 'Hello there!' };",
        "  render() {",
        "    return <div />;",
        "  }",
        "}"
      ].join("\n"),
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 2,
          column: 29,
          type: "Literal"
        }
      ]
    },
    {
      code: [
        "class SomeComponent extends React.Component {",
        "  static displayName = 'SomeComponent';",
        "  static name = 'Some name';",
        "  render() {",
        "    return <div />;",
        "  }",
        "}"
      ].join("\n"),
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 3,
          column: 17,
          type: "Literal"
        }
      ]
    },
    {
      code: "<div>text</div>",
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 6,
          type: "Literal"
        }
      ]
    },
    {
      code: "<Icon name='Chevron' />",
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 12,
          type: "Literal"
        }
      ]
    },
    {
      code: "<img src='../image.png' alt='image' />",
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 29,
          type: "Literal"
        }
      ]
    },
    {
      code: "<button aria-label='Close' type='button' />",
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 20,
          type: "Literal"
        }
      ]
    },
    {
      code: "<iframe src='https://github.com' title='Github' />",
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 40,
          type: "Literal"
        }
      ]
    },
    {
      code: "<input placeholder='John' id='first-name' name='first-name' />",
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 20,
          type: "Literal"
        }
      ]
    },
    {
      code: "<div>{num} {people}</div>",
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 1,
          column: 11,
          type: "Literal"
        }
      ]
    },
    {
      code: [
        "<svg width='1300px' height='383px' viewBox={`0 0 ${width} 383`} version='1.1' xmlns='http://www.w3.org/2000/svg' aria-labelledby='svgTitle svgDesc'>",
        "  <title id='svgTitle'>SVG title</title>",
        "  <desc id='svgDesc'>SVG description</desc>",
        "  <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>",
        "    <g id='chevron' stroke='#000000' transform='translate(1.000000, 0.000000)' strokeWidth='1.5'>",
        "      <polyline points='0 0.698834 4.025585 4.724419 8.05117 0.698834' />",
        "    </g>",
        "  </g>",
        "</svg>"
      ].join("\n"),
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 2,
          column: 24,
          type: "Literal"
        },
        {
          message: ERROR_MESSAGE,
          line: 3,
          column: 22,
          type: "Literal"
        }
      ]
    }
  ]
});
