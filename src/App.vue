<template lang="pug">
  div
    h1 CHSM - Chromatic Harmonica Score Maker
    .container
      .left
        .form
          | Input 
          a(href="https://en.wikipedia.org/wiki/ABC_notation" target="_blank") ABC Notation
          |  Score.
          br
          textarea#abc-source(v-model="tune" @input="transformAbc")
          br
          | Offset pitch:
          input(type="number" v-model="offsetPitch" @input="transformAbc" @change="transformAbc")
          | e.g. -12 means one octave down.
          br
          button(onclick="window.print()") print
      .right
        #midi
        #abc(ref="abcObj")
</template>

<script>
  import "font-awesome/css/font-awesome.min.css"
  import 'abcjs/abcjs-midi.css'
  import abcjs from "abcjs/midi"
  import AbcHarmonicaScoreMaker from "./utils/AbcHarmonicaScoreMaker.js"
  
  const defaultAbcText = `T:Greensleeves
M:C
L:1/8
Q:90
K:G
A | c2 d e>fe | d2 B G>AB | c2 A A>^GA |
B2 ^G E2 A | c2 d e>fe | d2 B G>AB |
c>BA ^G>FG | A3 A3 || g3 g>fe | d2 B G>AB |
c2 A A>^GA | B2 ^G E3 | g3 g>fe | d2 B G>AB |
c>BA ^G>FG | A3 A2 |]
`
  const defaultAbcText2 = 'X:1\nT: Cooley\'s\nM: 4/4\nL: 1/8\nR: reel\nK: Emin\nD2|:"Em"EB{c}BA B2 EB|~B2 AB dBAG|"D"FDAD BDAD|FDAD dAFD|\n"Em"EBBA B2 EB|B2 AB defg|"D"afe^c dBAF|1"Em"DEFD E2 D2:|2"Em"DEFD E2 gf||\n|:"Em"eB B2 efge|eB B2 gedB|"D"A2 FA DAFA|A2 FA defg|\n"Em"eB B2 eBgB|eB B2 defg|"D"afe^c dBAF|1"Em"DEFD E2 gf:|2"Em"DEFD E4|]\n'

  export default {
    mounted() {
      this.abcHarmonicaScoreMaker = new AbcHarmonicaScoreMaker()
      this.transformAbc()
    },
    data () {
      return {
        tune: defaultAbcText,
        offsetPitch: -12
      };
    },
    methods: {
      transformAbc() {
        new abcjs.Editor("abc-source", {
          canvas_id: "abc",
          generate_midi: true,
          midi_id: "midi",
          abcjsParams: {
            animate: {
              listener: this.animate,
            },
            //responsive: "resize",
            afterParsing: this.addHarmonicaTab,
            oneSvgPerLine: true
          }
        })
        this.abcHarmonicaScoreMaker.addUnderline(this.$refs.abcObj)
      },
      colorRange(range, color) {
        if (range && range.elements) {
          range.elements.forEach(function (set) {
            set.forEach(function (item) {
              item.setAttribute("fill", color)
            })
          })
        }
      },
      animate(lastRange, currentRange) {
        this.colorRange(lastRange, "#000000")
        this.colorRange(currentRange, "#3D9AFC")
      },
      addHarmonicaTab(tuneObj) {
        this.abcHarmonicaScoreMaker.transform(tuneObj, Number(this.offsetPitch))
      }
    }
  }
</script>

<style lang="sass" scoped>
h1
  font-size: 35px
  width: 100%
  height: 50px
  text-align: center
  color: white
  background-color: green

.container
  display: flex
  justify-content: center
  margin: 10px
  .left
    width: 400px
    textarea
      width: 100%
      height: 600px
    button, input
      margin-right: 10px
      margin-bottom: 5px
  .right
    margin-left: 30px
#abc, #midi
  max-width: 800px

@media screen and (max-width: 1200px)
  .container
    display: block
    .left
      width: 600px
      textarea
        width: 100%
        height: 300px
    .right
      margin-left: 0

@media print
  h1, .form, #midi, .left
    display: none
  div, .container
    display: inline
  #abc
    top: 0
    left: 0
    width: 100%
    height: 251mm
  @page
    margin: 0
</style>