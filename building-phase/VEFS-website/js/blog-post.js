(function() {
    const url = location.href;
    const title = document.title;
    const wa = document.getElementById('share-wa');
    const fb = document.getElementById('share-fb');
    const tw = document.getElementById('share-tw');
    const copy = document.getElementById('share-copy');
    if (!wa) return;

    wa.href = 'https://wa.me/?text=' + encodeURIComponent(title + ' ' + url);
    fb.href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url);
    tw.href = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(title) + '&url=' + encodeURIComponent(url);
    copy.addEventListener('click', () => {
        navigator.clipboard.writeText(url);
        copy.textContent = 'Copied ✓';
        setTimeout(() => copy.textContent = 'Copy link', 2000);
    });
})();
