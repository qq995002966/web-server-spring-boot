var position = {
  center: {
    origin: {
      x: null,
      y: null
    },
    current: {
      x: null,
      y: null
    }
  },
  child: []
}

var data = [
  {
    text: '王者荣耀',
    ralationship:'公司1',
    image: '1.png',
    child: [
      {
        text: '222', 
        ralationship:'相关1.1',
        image: '2.png',
        child: [
            {text: '222', ralationship:'相关1.1',image: '2.png'},
            {text: '222', ralationship:'相关1.2',image: '1.png'}
          ]
      },
      {
        text: '222', 
        ralationship:'相关1.2',
        image: '1.png',
        child: [
            {text: '222', ralationship:'相关1.1',image: '2.png'},
            {text: '222', ralationship:'相关1.2',image: '1.png'}
          ]
      },
      {
        text: '222',
        ralationship:'相关1.3',
         image: '3.png',
         child: [
            {text: '222', ralationship:'相关1.1',image: '2.png'},
            {text: '222', ralationship:'相关1.2',image: '1.png'}
          ]
       }
    ]
  },
  {
    text: '王者荣耀',
    ralationship:'TAG2',
    image: '2.png',
    child: [
      {
        text: '222',
        ralationship:'相关2.1',
         image: '1.png',
        child: [
            {text: '222', ralationship:'相关1.1',image: '2.png'},
            {text: '222', ralationship:'相关1.2',image: '1.png'}
          ]
        },
      {
        text: '222',
        ralationship:'相关2.2',
         image: '8.png',
        child: [
            {text: '222', ralationship:'相关1.1',image: '2.png'},
            {text: '222', ralationship:'相关1.2',image: '1.png'}
          ]
        },
      {
        text: '222', 
        ralationship:'相关2.3',
        image: '1.png',
        child: [
            {text: '222', ralationship:'相关1.1',image: '2.png'},
            {text: '222', ralationship:'相关1.2',image: '1.png'}
          ]
        }
    ]
  },
  {
    text: '王者荣耀',
    ralationship:'开发商3',
    image: '3.png',
    child: [
      {
        text: '222',
        ralationship:'相关3.1',
         image: '1.png',
        child: [
            {text: '222', ralationship:'相关1.1',image: '2.png'},
            {text: '222', ralationship:'相关1.2',image: '1.png'}
          ]
        },
      {
        text: '222',
        ralationship:'相关3.2',
         image: '8.png',
        child: [
            {text: '222', ralationship:'相关1.1',image: '2.png'},
            {text: '222', ralationship:'相关1.2',image: '1.png'}
          ]
        },
      {
        text: '222', 
        ralationship:'相关3.3',
        image: '1.png',
        child: [
            {text: '222', ralationship:'相关1.1',image: '2.png'},
            {text: '222', ralationship:'相关1.2',image: '1.png'}
          ]
        }
    ]
  },
  {
    text: '王者荣耀',
     ralationship:'发行商4',
    image: '4.png',
    child: [
      {
        text: '222',
        ralationship:'相关4.1', 
        image: '1.png',
        child: [
            {text: '222', ralationship:'相关1.1',image: '2.png'},
            {text: '222', ralationship:'相关1.2',image: '1.png'}
          ]
        },
      {
        text: '222',
        ralationship:'相关4.2',
         image: '8.png',
        child: [
            {text: '222', ralationship:'相关1.1',image: '2.png'},
            {text: '222', ralationship:'相关1.2',image: '1.png'}
          ]
        },
      {
        text: '222', 
        ralationship:'相关4.3',
        image: '1.png',
        child: [
            {text: '222', ralationship:'相关1.1',image: '2.png'},
            {text: '222', ralationship:'相关1.2',image: '1.png'}
          ]
        }
    ]
  },
  {
    text: '王者荣荣耀荣耀耀',
     ralationship:'相似5',
    image: '5.png',
    child: [
      {
        text: '222',
        ralationship:'相关5.1',
         image: '1.png',
        child: [
            {text: '222', ralationship:'相关1.1',image: '2.png'},
            {text: '222', ralationship:'相关1.2',image: '1.png'}
          ]
        },
      {
        text: '222',
        ralationship:'相关5.2', 
        image: '8.png',
        child: [
            {text: '222', ralationship:'相关1.1',image: '2.png'},
            {text: '222', ralationship:'相关1.2',image: '1.png'}
          ]
        },
      {
        text: '222', 
        ralationship:'相关5.3',
        image: '1.png',
        child: [
            {text: '222', ralationship:'相关1.1',image: '2.png'},
            {text: '222', ralationship:'相关1.2',image: '1.png'}
          ]
        }
    ]
  },
   {
    text: '王者荣耀',
     ralationship:'公司6',
    image: '6.png',
        child: [
      {
        text: '222',
        ralationship:'相关6.1', 
        image: '1.png',
        child: [
            {text: '222', ralationship:'相关1.1',image: '2.png'},
            {text: '222', ralationship:'相关1.2',image: '1.png'}
          ]
        },
      {
        text: '222',
        ralationship:'相关6.2', 
        image: '8.png',
        child: [
            {text: '222', ralationship:'相关1.1',image: '2.png'},
            {text: '222', ralationship:'相关1.2',image: '1.png'}
          ]
        },
      {
        text: '222', 
        ralationship:'相关6.3',
        image: '1.png',
        child: [
            {text: '222', ralationship:'相关1.1',image: '2.png'},
            {text: '222', ralationship:'相关1.2',image: '1.png'}
          ]
        }
    ]
  },
   {
    text: '王者荣耀',
     ralationship:'发行商7',
    image: '7.png',
        child: [
      {
        text: '222',
        ralationship:'相关7.1',
         image: '1.png',
        child: [
            {text: '222', ralationship:'相关1.1',image: '2.png'},
            {text: '222', ralationship:'相关1.2',image: '1.png'}
          ]
        },
      {
        text: '222',
        ralationship:'相关7.2', 
        image: '8.png',
        child: [
            {text: '222', ralationship:'相关1.1',image: '2.png'},
            {text: '222', ralationship:'相关1.2',image: '1.png'}
          ]
        },
      {
        text: '222', 
        ralationship:'相关7.3',
        image: '1.png',
        child: [
            {text: '222', ralationship:'相关1.1',image: '2.png'},
            {text: '222', ralationship:'相关1.2',image: '1.png'}
          ]
        }
    ]
  },
   {
    text: '王者荣耀',
     ralationship:'TAG8',
    image: '8.png',
        child: [
      {
        text: '222',
        ralationship:'相关8.1', 
        image: '1.png',
        child: [
            {text: '222', ralationship:'相关1.1',image: '2.png'},
            {text: '222', ralationship:'相关1.2',image: '1.png'}
          ]
        },
      {
        text: '222',
        ralationship:'相关8.2',
         image: '8.png',
        child: [
            {text: '222', ralationship:'相关1.1',image: '2.png'},
            {text: '222', ralationship:'相关1.2',image: '1.png'}
          ]
        },
      {
        text: '222', 
        ralationship:'相关8.3',
        image: '1.png',
        child: [
            {text: '222', ralationship:'相关1.1',image: '2.png'},
            {text: '222', ralationship:'相关1.2',image: '1.png'}
          ]
        }
    ]
  },
  {
    text: '王者荣耀',
     ralationship:'发行商9',
    image: '9.png',
    child: [
      {
        text: '222',
        ralationship:'相关9.1', 
        image: '1.png',
      child: [
            {text: '222', ralationship:'相关1.1',image: '2.png'},
            {text: '222', ralationship:'相关1.2',image: '1.png'}
          ]
        },
      {
        text: '222',
        ralationship:'相关9.2', 
        image: '8.png',
      child: [
            {text: '222', ralationship:'相关1.1',image: '2.png'},
            {text: '222', ralationship:'相关1.2',image: '1.png'}
          ]
        },
      {
        text: '222', 
        ralationship:'相关9.3',
        image: '1.png',
      child: [
            {text: '222', ralationship:'相关1.1',image: '2.png'},
            {text: '222', ralationship:'相关1.2',image: '1.png'}
          ]}
    ]
  }
]
