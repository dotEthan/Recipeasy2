<script setup lang="ts">
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-12">
        <div class="titleback">
          <h1 class="app-title">Welcome to Tastyista</h1>
          <span>(Redesign Underway)</span>
        </div>
      </div>
    </div>
  </div>

</template>

<style lang="sass" scoped>
@use '@/assets/variables' as *

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

.app-title
  margin-bottom: 25px
  font-size: 2em

  @media (min-width: 768px)
    font-size: 4em



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
