
export default function timeAgo(timestamp) {
    // If timestamp is not falsy (i.e. undefined)
    if (timestamp) {
        // The timestamps in our database have a 'Z' at the end, which
        // will tell JS to read them as UTC time stamps.
        console.log(timestamp);
        const date = new Date(timestamp);
        const now = new Date(); 
        const diffInSeconds = Math.floor((now - date) / 1000);

        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 },
            { label: 'second', seconds: 1 }
        ];

        for (const interval of intervals) {
            const count = Math.floor(diffInSeconds / interval.seconds);

            if (count >= 1) {
                // RelativeTimeFormat is a JS builtin that turns -N and "days" into "N days ago".
                const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
                return rtf.format(-count, interval.label);
            }
        }

        return 'just now';
    } else {
        return "???"
    }
}
