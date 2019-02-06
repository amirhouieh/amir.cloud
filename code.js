const bluryfy = (elem, volume, color) => {
    elem.style.textShadow = `${color} 0px 0px ${~~volume}px`;
    elem.style.color = "transparent";
};
const remap = (value, low1, high1, low2, high2) => {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
};
const calcDistance = (p1, p2) => {
    const a = p2.x - p1.x;
    const b = p2.y - p1.y;
    return Math.sqrt(a * a + b * b);
};
const calcElemCenter = (elem) => {
    const rect = elem.getBoundingClientRect();
    return {
        x: rect.x + (rect.width / 2),
        y: rect.y + (rect.height / 2),
    }
};
const state = {
    thumbsCenter: [],
    updateMaxDistance: 1000
};
const MIN_BLUR = 0;
const MAX_BLUR = 75;
const BODY_MARGIN = 50;
window.onload = () => {
    const thumbs = [].slice.call(document.querySelectorAll(".blur"));
    const deviceAgent = navigator.userAgent.toLowerCase();

    const isTouch = (deviceAgent.match(/(iphone|ipod|ipad)/) ||
        deviceAgent.match(/(android)/) ||
        deviceAgent.match(/(iemobile)/) ||
        deviceAgent.match(/iphone/i) ||
        deviceAgent.match(/ipad/i) ||
        deviceAgent.match(/ipod/i) ||
        deviceAgent.match(/blackberry/i) ||
        deviceAgent.match(/bada/i) ||
        deviceAgent.match(/mobile/i)
    ) !== null;

    console.log(deviceAgent, isTouch);

    const updateThumbsCenter = () => {
        state.thumbsCenter = thumbs.map(calcElemCenter);
    };

    const updateMaxDistance = () => {
        state.maxDistance = calcDistance(
            {x: BODY_MARGIN, y: BODY_MARGIN},
            {x: window.innerWidth, y: window.innerHeight}
        );
    };

    updateThumbsCenter();
    updateMaxDistance();

    const updateThumbsBlur = (x, y) => {
        thumbs.forEach((thumb, i) => {
            const thumbCenter = state.thumbsCenter[i];
            const mouseCenter = {x, y};
            const dx = calcDistance(thumbCenter, mouseCenter);
            const blurVolume = remap(dx, 0, state.maxDistance, MIN_BLUR, MAX_BLUR);
            bluryfy(thumb, blurVolume, "black");
        })
    }

    if (!isTouch) {
        window.onmousemove = (e) => {
            updateThumbsBlur(e.clientX, e.clientY);
        }
    } else {
        console.log("your device is a touch screen device.");

        thumbs.forEach((thumb) => {
            const link = thumb.querySelector("a");

            if (link) {
                thumb.dataset.url = link.href;
                link.href = "javascript:;"
            }

            thumb.onclick = (event) => {
                console.log(event.clientX, event.clientY);
                updateThumbsBlur(event.clientX, event.clientY);
                //reset others
                thumbs.forEach((_thumb) => {
                    if (_thumb.dataset.url !== thumb.dataset.url) {
                        _thumb.classList.remove("clicked")
                    }
                });

                if (thumb.classList.contains("clicked")) {
                    if (thumb.dataset.url) {
                        window.location.href = thumb.dataset.url;
                    }
                } else {
                    thumb.classList.add("clicked")
                }
            };
        });

        window.onresize = () => {
            updateThumbsCenter();
            updateMaxDistance();
        };

    }

};
