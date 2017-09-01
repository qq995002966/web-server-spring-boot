// particlesJS("particles-js", {
//     "particles":

//     {
//         "number": {
//             "value": 50,
//             "density": {
//                 "enable": true,
//                 "value_area": 800
//             }
//         },
//         "color": { "value": "#ffffff" },
//         "shape": {
//             "type": "circle",
//             "stroke": { "width": 0, "color": "#000000" },
//             "polygon": { "nb_sides": 5 },
//             "image": {
//                 "src": "img/github.svg",
//                 "width": 100,
//                 "height": 100
//             }
//         },
//         "opacity": {
//             "value": 1,
//             "random": true,
//             "anim": { "enable": true, "speed": 1, "opacity_min": 0, "sync": false }
//         },
//         "size": {
//             "value": 3,
//             "random": true,
//             "anim": {
//                 "enable": false,
//                 "speed": 4,
//                 "size_min": 0.3,
//                 "sync": false
//             }
//         },
//         "line_linked": {
//             "enable": false,
//             "distance": 150,
//             "color": "#ffffff",
//             "opacity": 0.4,
//             "width": 1
//         },
//         "move": {
//             "enable": true,
//             "speed": 1,
//             "direction": "none",
//             "random": true,
//             "straight": false,
//             "out_mode": "out",
//             "bounce": false,
//             "attract": {
//                 "enable": false,
//                 "rotateX": 600,
//                 "rotateY": 600
//             }
//         }
//     },
//     "interactivity": {
//         "detect_on": "canvas",
//         "events": {
//             "onhover": {
//                 "enable": true,
//                 "mode": "bubble"
//             },
//             "onclick": {
//                 "enable": true,
//                 "mode": "repulse"
//             },
//             "resize": true
//         },
//         "modes": {
//             "grab": {
//                 "distance": 400,
//                 "line_linked": {
//                     "opacity": 1
//                 }
//             },
//             "bubble": {
//                 "distance": 250,
//                 "size": 0,
//                 "duration": 2,
//                 "opacity": 0,
//                 "speed": 3
//             },
//             "repulse": {
//                 "distance": 400,
//                 "duration": 0.4
//             },
//             "push": {
//                 "particles_nb": 4
//             },
//             "remove": {
//                 "particles_nb": 2
//             }
//         }
//     },
//     "retina_detect": true
// });


// 粒子动画调用
/* ---- particles.js config ---- */
particlesJS("particles-js", {
    "particles": {
        "number": {
            "value": 80,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": "#fff"
        },
        "shape": {
            "type": "circle",
            "stroke": {
                "width": 1,
                "color": "#ccc"
            },
            "polygon": {
                "nb_sides": 5
            },
            "image": {
                "src": "img/github.svg",
                "width": 100,
                "height": 100
            }
        },
        "opacity": {
            "value": 1,
            "random": false,
            "anim": {
                "enable": false,
                "speed": 0,
                "opacity_min": 0.1,
                "sync": false
            }
        },
        "size": {
            "value": 35,
            "random": true,
            "anim": {
                "enable": false,
                "speed": 10,
                "size_min": 1,
                "sync": false
            }
        },
        "line_linked": {
            "enable": true,
            "distance": 180,
            "color": "#ccc",
            "opacity": 0.5,
            "width": 2
        },
        "move": {
            "enable": true,
            "speed": 0.2,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "grab"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 140,
                "line_linked": {
                    "opacity": 1
                }
            },
            "bubble": {
                "distance": 400,
                "size": 40,
                "duration": 2,
                "opacity": 8,
                "speed": 3
            },
            "repulse": {
                "distance": 200,
                "duration": 0.4
            },
            "push": {
                "particles_nb": 4
            },
            "remove": {
                "particles_nb": 2
            }
        }
    },
    "retina_detect": true
});
