module.exports = {
  mode:'jit',
  purge:["./src/**/*.{js,jsx,ts,tsx}","./public/index.html"],
  darkMode:false,
  theme: {
    extend: {
      backgroundColor: {
        'green-resonate': '#D5DDCF',
        'green-resonate2': '#979D92',
        'yellow-resonate': '#F1EBE5',
        'yellow2-resonate': '#F1F1E7',
        'yellow3-resonate': '#FAF5CC',
        'orange-resonate': '#F4D487',
        'black-resonate': '#423F32',
      },
      textColor:{
        'black-resonate': '#423F32',
      },
      borderColor: {
        'green-resonate2': '#979D92',
        'orange-resonate': '#F4D487',
        'yellow-resonate': '#F1EBE5',
        'black-resonate': '#423F32',
      },
      ringColor: {
        'yellow-resonate': '#F1EBE5',
        'orange-resonate': '#F4D487',
        'black-resonate': '#423F32',
      },
      fontFamily: {
        reborn: ["REBORN", "sans-serif"],
        CG_Reg: ["CG_Reg", "sans-serif"],
      },
    },
  },
  variants: {
    extend:{},
  },
  plugins: [],
}
