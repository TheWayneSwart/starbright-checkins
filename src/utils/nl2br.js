export function nl2br(text) {
    if (!text) return '';
    return text.replace(/\n/g, '<br>');
}