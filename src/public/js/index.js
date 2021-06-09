const body = document.querySelector('body');
const loader = document.querySelector('.loader');
const noneBlock = document.querySelector('.noneBlock');
noneBlock.style.display = 'none';

window.onload = function () {
  setTimeout(() => {
    noneBlock.style.display = 'block';
    loader.style.display = 'none';
  }, 200);
};
