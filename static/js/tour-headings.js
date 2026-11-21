document.querySelectorAll('.tour h2').forEach(heading => {
  const found = /^Chapter (\d+): (.*)$/.exec(heading.textContent);
  if (!found) return;
  const label = document.createElement('span');
  label.className = 'chapter-num';
  label.textContent = 'Chapter ' + found[1];
  heading.replaceChildren(label, document.createTextNode(found[2]));
});
