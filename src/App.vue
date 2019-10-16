<template lang="pug">
  div
    h1 CHSM - Chromatic Harmonica Score Maker
    .form
      | Input ABC Score.
      br
      textarea(ref="abcInput") {{defaultAbcText}}
      br
      | Offset pitch:
      input(v-model="offsetPitch")
      | e.g. -12 means one octave down.
      br
      button(@click="transformAbc") reRender
      button(onclick="window.print()") print
    #abc(ref="abcObj")
</template>

<script>
import abcjs from "abcjs";
import AbcHarmonicaScoreMaker from "./utils/AbcHarmonicaScoreMaker.js"

const defaultAbcText =
`
T:Greensleeves
M:6/8
L:1/8
K:G
A | c2 d e>fe | d2 B G>AB | c2 A A>^GA |
B2 ^G E2 A | c2 d e>fe | d2 B G>AB |
c>BA ^G>FG | A3 A3 || g3 g>fe | d2 B G>AB |
c2 A A>^GA | B2 ^G E3 | g3 g>fe | d2 B G>AB |
c>BA ^G>FG | A3 A2 |]
`

export default {
  data() {
    return {
      defaultAbcText: defaultAbcText,
      offsetPitch: -12,
      scoreMaker: null,
    }
  },

  mounted() {
    this.abcHarmonicaScoreMaker = new AbcHarmonicaScoreMaker()
    this.transformAbc()
  },

  methods: {
    transformAbc() {
      let configure = {
        responsive: "resize",
        afterParsing: this.addHarmonicaTab,
        format: {
            annotationfont: "Times New Roman",
        },
        oneSvgPerLine: true
      }
      abcjs.renderAbc("abc", this.$refs.abcInput.value, configure)[0]
      this.abcHarmonicaScoreMaker.addUnderline(this.$refs.abcObj)
    },
    addHarmonicaTab(tuneObj) {
      this.abcHarmonicaScoreMaker.transform(tuneObj, Number(this.offsetPitch))
    },
  },
}
</script>

<style lang="sass" scoped>
h1
  color: green

textarea
  width: 500px
  height: 100px

button, input
  margin-right: 10px

#abc
  max-width: 800px

@media print
  h1, .form
    display: none
  #abc
    top: 0
    left: 0
    width: 172mm
    height: 251mm
</style>
