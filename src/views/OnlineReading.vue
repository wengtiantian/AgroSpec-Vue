<script setup>
import PDFViewer from '@/components/PdfViewer/index.vue'
// import PDFSrc from '@/assets/files/Markdown.pdf'

// const PDFSrc = new URL('@/assets/files/Markdown.pdf', import.meta.url).href
// pdf document pages are rendered. Can be used to set default pages scale
const route = useRoute();
const PDFSrc = ref(route.query.src || '123.pdf')

function onLoaded(pdfApp) {
    console.log('loaded app:', pdfApp)
}
</script>
<template>
    <div class="pdf-content">
        <PDFViewer page-scale="page-fit" :height="'88vh'" theme="dark" :src="PDFSrc" @loaded="onLoaded" />
    </div>
</template>

<style lang="less" scoped>
.pdf-content {
    padding-top: 80px;
}
</style>
 