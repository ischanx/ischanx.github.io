export const enhanceHeadingAnchors = (container: Element) => {
  const headings = container.querySelectorAll('h1,h2, h3, h4, h5, h6');

  headings.forEach(heading => {
    const id = heading.id;

    if (!id) return;
    if (heading.querySelector(`:scope > a[href="#${CSS.escape(id)}"]`)) {
      return;
    }

    const anchor = document.createElement('a');
    anchor.href = `#${id}`;
    anchor.classList.add('heading-anchor');
    anchor.classList.add('inline-block', 'ml-2');
    anchor.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>';
    anchor.title = '链接到此标题';

    anchor.addEventListener('click', e => {
      e.preventDefault();
      const targetHeading = document.getElementById(id);
      if (!targetHeading) return;

      window.scrollTo({
        top: targetHeading.offsetTop + 100,
        behavior: 'smooth',
      });

      history.pushState(null, '', `#${id}`);
    });

    heading.appendChild(anchor);
  });
};
