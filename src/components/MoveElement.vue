<template>
<li class="move-item-wrapper">
    <keep-alive>
        <slot></slot>
    </keep-alive>
</li>
</template>

<script>
export default {
    name: 'MoveElement'
}
</script>

<style>
/* 拖放添加 表单控件(item) 样式 */
.move-item-wrapper {
    width: 650px;
    height: 56px;
    border: 1px dashed #43acf7;
    background-color: #ffffe5;
    position: fixed;
    left: -100%;
    top: -100%;
    opacity: 0;
    cursor: move;
}
.move-item-wrapper::after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0);
    z-index: 1;
}
</style>