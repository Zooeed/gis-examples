<template>
	<div class="page">
		<PageHeader></PageHeader>
		<PageBody></PageBody>
	</div>
</template>

<script setup>
import { ref } from 'vue';

import PageHeader from '../../components/homePage/header.vue'
import PageBody from '../../components/homePage/body.vue'



</script>

<style lang="scss" scoped>
.page {
	width: 100%;
	height: 100%;
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: 100px 1fr;
}
</style>