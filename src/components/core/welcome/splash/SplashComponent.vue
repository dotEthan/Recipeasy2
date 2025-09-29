<script setup lang="ts">
/**
 * Component to display non-logged in splash screen
 * @todo Remove and redesign Welcome page
 * @example
 *  <SplashComponent />
 */
</script>

<template>
  <div
    class="h-[50dvh] md:h-[75dvh] flex flex-col-reverse mt-20 md:mt-0 md:flex-row max-w-[1500px] mx-auto">
    <div class="flex-1 text-left flex justify-center items-center">
      <div class="max-w-[500px] p-10 rounded-md text-center md:text-left">
        <h1 class="font-brand mb-6 text-5xl md:text-8xl">
          Tasty<span class="text-accent">ista</span>
        </h1>
        <h2 class="text-sm md:text-lg">
          Create, discover, and plan your perfect meals with our sophisticated recipe management
          system.
        </h2>
      </div>
    </div>
    <div class="flex-1 flex justify-center items-center">
      <div class="image-shadows max-w-[600px] relative">
        <!-- <div
          class="bg-accent w-75 h-75 opacity-75 rounded-lg absolute top-0 left-0 rotate-30"></div>
        <div
          class="bg-surface w-75 h-75 opacity-75 rounded-lg absolute top-0 left-0 rotate-20"></div> -->
        <img
          src="https://res.cloudinary.com/dotethan/image/upload/v1758303573/Recipeasy/pexels-photo-1640772.jpg"
          class="w-[clamp(200px,35vw,600px)] rounded-lg rotate-2 hover:rotate-0 duration-200"
          alt="Picture of food" />
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.image-shadows
  z-index: 1

  &::before,
  &::after
    content: ''
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    border-radius: 0.5rem
    opacity: 0.75
    z-index: -1

  &::before
    background: var(--color-accent)
    transform: rotate(20deg)

  &::after
    background: var(--color-surface)
    transform: rotate(13deg)


.app-title
  margin-bottom: 25px
  font-size: 2em

  @media (min-width: 768px)
    font-size: 4em

.container
  position: relative

.titleback
  display: flex
  flex-direction: column
  align-items: center
  padding: 5px 10px
  border-radius: 10px
  text-align: center
  width: 100%

  @media (min-width: 768px)
    padding: 15px 30px

  h1
    font-family: 'Limelight', sans-serif
    margin: 0

  span
    font-size: .6rem

    @media (min-width: 768px)
     font-size: .8rem

// .app-title
//   margin-bottom: 25px
//   font-size: 2em

//   @media (min-width: 768px)
//     font-size: 4em



.testmode-btn
  padding: 5px
  max-width: 200px
  color: #666
  font-family: 'Montserrat', sans-serif
  font-weight: bold
  border-radius: 5px
  font-size: 0.8em
  border-color: #eef #898989 #898989 #eef
  background: #eef

  @media (min-width: 768px)
    padding: 10px
</style>
