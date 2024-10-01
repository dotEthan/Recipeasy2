<script setup lang="ts">
function onMobileMenuClick() {
  console.log('mobilemenu')
  // this.$refs.headerMenu.nativeElement.classList.toggle('active');
  // this.$refs.beyondBurger.nativeElement.children[0].classList.toggle('active');
  // const childLength = this.beyondBurger.nativeElement.children[0].children.length;
  // for (let i = 0; i < childLength; i++) {
  //     this.$refs.beyondBurger.nativeElement.children[0].children[i].classList.remove('stopped');
  // }
}
</script>

<template>
  <div class="beyond-burger" @click="onMobileMenuClick()" ref="beyondburger">
    <div class="burger-container">
      <div class="line1 stopped"></div>
      <div class="line2 stopped"></div>
      <div class="line3 stopped"></div>
    </div>
  </div>
</template>

<style lang="scss">
@import '../../../../assets//variables.scss';
.beyond-burger {
  position: relative;
  display: block;
  width: 50px;
  height: 50px;
  cursor: pointer;

  @media (min-width: 768px) {
    display: none;
  }

  &:hover {
    .line1,
    .line2,
    .line3 {
      background: #333;
    }
  }
}

.burger-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 25px;
  height: $iconheight;

  .line1 {
    animation: firstline--back 1s;
  }

  .line2 {
    margin: $spaceheight 0;
    animation: secondline--back 1s;
  }

  .line3 {
    animation: thirdline--back 1s;
  }

  &.active {
    .line1 {
      animation: firstline 1s forwards;
    }

    .line2 {
      animation: secondline 1s forwards;
    }

    .line3 {
      animation: thirdline 1s forwards;
    }
  }
}

.line1,
.line2,
.line3 {
  height: $lineheight;
  background: #666;
  border-radius: 2px;

  &:hover {
    background: #333;
  }
}

.stopped {
  -webkit-animation: none;
  animation: none !important;
}

@keyframes firstline {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY($lineoneoffset);
  }

  100% {
    transform: translateY($lineoneoffset) rotate(45deg);
  }
}

@keyframes secondline {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0);
  }

  100% {
    transform: scale(0);
  }
}

@keyframes thirdline {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-$lineoneoffset);
  }

  100% {
    transform: translateY(-$lineoneoffset) rotate(-45deg);
  }
}

@keyframes firstline--back {
  0% {
    transform: translateY($lineoneoffset) rotate(45deg);
  }

  50% {
    transform: translateY($lineoneoffset) rotate(0deg);
  }

  100% {
    transform: translateY(0);
  }
}

@keyframes secondline--back {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes thirdline--back {
  0% {
    transform: translateY(-$lineoneoffset) rotate(-45deg);
  }

  50% {
    transform: translateY(-$lineoneoffset) rotate(0deg);
  }

  100% {
    transform: translateY(0);
  }
}
</style>
