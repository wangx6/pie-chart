(function($) {
	'use strict';

	var samples,
    	data = getData(),
        sh = $('#chart-svg').height(),
        sw = $('#chart-svg').width(),
        radius = 100,
        startX = (sw - (2 * radius)) / 2 + radius,
        startY = (sh - (2 * radius)) / 2,
        centerX = startX,
        centerY = startY + radius,
        shelfGapFromPie = 30,
        rotation,
        CHART_SVG = $('#chart-svg'),
        TOOL_TIP_TEXT = $('#tool-tip-text'),
        animateDuration = 0.75,
        percentageTreshhold = 0.02;

    initPiChart(data);
    createTextShelf(data);
    setTimeout(function() {
        animateTotalVal(0, 0, Object.keys(data).length);
    }, 500);
    getCenterPoint(data);

    function getData() {
        samples = {
            0: {
                country: 'c1',
                val: 63,
                per: 0,
                color: '#c30'
            },
            1: {
                country: 'c2',
                val: 62,
                per: 0,
                color: '#390'
            },
            2: {
                country: 'c3',
                val: 40,
                per: 0,
                color: '#fc0'
            },
            3: {
                country: 'c4',
                val: 36,
                per: 0,
                color: '#c09'
            },
            4: {
                country: 'c5',
                val: 34,
                per: 0,
                color: '#f77c10'
            },
            5: {
                country: 'c6',
                val: 32,
                per: 0,
                color: '#666'
            },
            6: {
                country: 'c7',
                val: 30,
                per: 0,
                color: '#390'
            },
            7: {
                country: 'c8',
                val: 28,
                per: 0,
                color: '#fc0'
            },
            8: {
                country: 'c9',
                val: 27,
                per: 0,
                color: '#c09'
            },
            9: {
                country: 'c10',
                val: 27,
                per: 0,
                color: '#323c57'
            },
            10: {
                country: 'c11',
                val: 15,
                per: 0,
                color: '#666'
            },
            11: {
                country: 'c12',
                val: 15,
                per: 0,
                color: '#c09'
            },
            12: {
                country: 'c13',
                val: 10,
                per: 0,
                color: '#f77c10'
            },
            13: {
                country: 'c14',
                val: 8,
                per: 0,
                color: '#666'
            },
            14: {
                country: 'c15',
                val: 5,
                per: 0,
                color: '#323c57'
            },
            15: {
                country: 'c16',
                val: 5,
                per: 0,
                color: '#390'
            },
            16: {
                country: 'c17',
                val: 4,
                per: 0,
                color: '#fc0'
            },
            17: {
                country: 'c18',
                val: 2,
                per: 0,
                color: '#c09'
            }
        };
        return calculateRadians(calculatePercentage(samples));
    }


    function initPiChart(samples) {

        var eleNo = 0;
        rotation = 0;
        var gWrap = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        for (var key in data) {
            drawPiChart(data[key], rotation, gWrap);
            rotation += data[key].per * 360;
            eleNo++;
        }
        gWrap.setAttribute('id', 'g-wrap');
        CHART_SVG.append(gWrap);
    }

    function createTextShelf(data) {
        var shelfH = (radius + shelfGapFromPie) * 2 - 2,
            shelfRadius = radius + shelfGapFromPie,
        	shelfGap = 20,
            noOfShelf = shelfH / shelfGap,
            i = 0,
            x = 0,
            y = shelfH / 2,
            coList = [],
            c = 0;

        for (; i <= noOfShelf; i++) {
            x = Math.sqrt(shelfRadius * shelfRadius - y * y);
            coList[c] = [];
            coList[c]['shelfX'] = centerX + x;
            coList[c]['shelfY'] = centerY - y;
            coList[c]['isTaken'] = false;
            c++;
            coList[c] = [];
            coList[c]['shelfX'] = centerX - x;
            coList[c]['shelfY'] = centerY - y;
            coList[c]['isTaken'] = false;
            c++;
            y -= shelfGap;
        }

        var arcCoordinates = getCenterPoint(data);
        var z, dist1, dist2, targetX, targetY, targetIndex;
        var key;

        for (key in arcCoordinates) {
            dist1 = calculateDistance(arcCoordinates[key].arcCenterX, arcCoordinates[key].arcCenterY, coList[0].shelfX, coList[0].shelfY);
            if (arcCoordinates[key].per > percentageTreshhold) {
                for (z in coList) {
                    if (z < Object.keys(coList).length - 1) {

                        if (!coList[parseInt(z) + 1].isTaken) {
                            dist2 = calculateDistance(arcCoordinates[key].arcCenterX, arcCoordinates[key].arcCenterY, coList[parseInt(z) + 1].shelfX, coList[parseInt(z) + 1].shelfY);
                            if (dist1 > dist2) {
                                dist1 = dist2;
                                targetX = coList[parseInt(z) + 1].shelfX;
                                targetY = coList[parseInt(z) + 1].shelfY;
                                targetIndex = parseInt(z) + 1;
                            }
                        }
                    }
                }
                coList[targetIndex].isTaken = true;
                drawText(targetX, targetY, arcCoordinates[key].country, arcCoordinates[key].radians, key);
                drawLine(arcCoordinates[key].arcCenterX, arcCoordinates[key].arcCenterY, targetX, targetY, arcCoordinates[key].color);
            }
        }
        return coList;
    }

    function calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }

    function drawText(X, Y, content, radians, eleNo) {

        var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        text.setAttribute('x', X);
        text.setAttribute('y', Y);
        text.setAttribute('fill', '#ccc');
        text.setAttribute('id', 'text' + eleNo);
        text.setAttribute('class', 'text');
        text.setAttribute('style', 'text-transform:capitalize;font-size:12px;');
        text.textContent = content;

        g.appendChild(text);
        CHART_SVG.append(g);

        var w = $('#text' + eleNo).width();
        if (X < centerX) {
            text.setAttribute('x', X - w);
        }
        text.setAttribute('y', Y);
        $('.text').hide().delay(1000).fadeIn(1000);

    }

    function drawTestDots(X, Y, color) {

        var dot = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        dot.setAttribute('x', X);
        dot.setAttribute('y', Y);
        dot.setAttribute('fill', color);
        dot.setAttribute('width', '3');
        dot.setAttribute('height', '3');
        g.appendChild(dot);
        CHART_SVG.append(g);
    }

    function getCenterPoint(data) {
        var k, beta, alpha, phy, X, Y, x, temp = 0;
        for (k in data) {
            alpha = data[k].radians;
            beta = degToRadians(data[k].per * 360);
            temp += beta;
            phy = beta / 2 + alpha;
            Y = sh / 2 - radius * Math.cos(phy);
            X = alpha < Math.PI ? centerX + Math.sqrt(radius * radius - (centerY - Y) * (centerY - Y)) : centerX - Math.sqrt(radius * radius - (centerY - Y) * (centerY - Y));
            data[k].arcCenterX = X;
            data[k].arcCenterY = Y;
        }
        return data;
    }


    function drawLine(X, Y, x, y, color) {
        var path_line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        var R = radius + shelfGapFromPie;
        var QX = R / radius * X;
        var QY = R / radius * Y;
        var offset = 40;

        path_line.setAttribute('d', 'M ' + X + ' ' + Y + 'Q' + (x + 10) + ',' + (y) + ' ' + x + ',' + y + '');
        path_line.setAttribute('stroke', color);
        path_line.setAttribute('fill', 'none');
        path_line.setAttribute('stroke-width', '1px');
        path_line.setAttribute('class', 'line');
        g.appendChild(path_line);
        CHART_SVG.append(g);
        $('.line').hide().delay(800).fadeIn(1000);
    }

    function degToRadians(deg) {
        return deg * (Math.PI / 180);
    }

    function calculatePercentage(data) {
        var total = 0,
            key;
        for (key in data) {
            total += data[key].val;
        }
        for (key in data) {
            data[key].per = data[key].val / total;
        }
        return data;
    }

    function calculateRadians(data) {
        var key, rotation = 0;
        for (key in data) {
            samples[key].radians = degToRadians(rotation);
            rotation += samples[key].per * 360;
        }
        return data;
    }

    function drawPiChart(data, rotate, gWrap) {
        var percentage = data.per,
            line_radius = (rotate + 180 * percentage) / 360,
            X = Math.abs(Math.sin(percentage * 2 * Math.PI)),
            Y = Math.abs(Math.cos(percentage * 2 * Math.PI)),
            piToX,
            piToY;

        Y = percentage <= 0.25 && percentage >= 0 || percentage > 0.75 && percentage <= 1 ? -Y : Y;
        X = percentage > 0.5 && percentage <= 0.75 || percentage > 0.75 && percentage <= 1 ? -X : X;


        piToX = X * radius + centerX;
        piToY = Y * radius + centerY;


        var d = 'M' + startX + ',' + startY + ' A' + radius + ',' + radius + ' 0 0,1 ' + piToX + ',' + piToY + ' L' + centerX + ',' + centerY + ' L' + startX + ',' + startY + ' z ';

        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        var set_1 = document.createElementNS('http://www.w3.org/2000/svg', 'set');
        var set_2 = document.createElementNS('http://www.w3.org/2000/svg', 'set');

        var anim = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
        var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        anim.setAttribute('attributeType', 'xml');
        anim.setAttribute('attributeName', 'transform');
        anim.setAttribute('begin', '0.5s');
        anim.setAttribute('dur', animateDuration + 's');
        anim.setAttribute('repeatCount', '1');
        anim.setAttribute('fill', 'freeze');
        anim.setAttribute('type', 'rotate');
        anim.setAttribute('from', '0 ' + centerX + ' ' + centerY + '');
        anim.setAttribute('to', rotation + ' ' + centerX + ' ' + centerY + '');

        set_1.setAttribute('begin', 'mouseover');
        set_1.setAttribute('end', 'mouseout');
        set_1.setAttribute('attributeName', 'fill');
        set_1.setAttribute('from', data.color);
        set_1.setAttribute('to', increaseBrightness(data.color, 25));

        set_2.setAttribute('begin', 'mouseover');
        set_2.setAttribute('end', 'mouseout');
        set_2.setAttribute('attributeName', 'stroke');
        set_2.setAttribute('from', 'transparent');
        set_2.setAttribute('to', '#fff');

        path.setAttribute('d', d);
        path.setAttribute('style', 'fill:' + data.color);
        path.setAttribute('id', data.country + ': ' + (data.per * 100).toFixed(1) + '%');
        path.setAttribute('class', 'country-pi');
        path.setAttribute('color', data.color);

        path.appendChild(set_1);
        path.appendChild(set_2);
        path.appendChild(anim);

        g.appendChild(path);
        gWrap.appendChild(g);
        return gWrap;
    }

    function increaseBrightness(hex, percent) {
        hex = hex.replace(/^\s*#|\s*$/g, '');

        if (hex.length == 3) {
            hex = hex.replace(/(.)/g, '$1$1');
        }

        var r = parseInt(hex.substr(0, 2), 16),
            g = parseInt(hex.substr(2, 2), 16),
            b = parseInt(hex.substr(4, 2), 16);

        return '#' +
            ((0 | (1 << 8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
            ((0 | (1 << 8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
            ((0 | (1 << 8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
    }

    $('body')
        .on('mouseover', '.country-pi', function() {
            TOOL_TIP_TEXT.html($(this).attr('id')).show().css({
                'background-color': $(this).attr('color'),
                'color': '#fff'
            });
        })
        .on('mouseout', '.country-pi', function() {
            TOOL_TIP_TEXT.hide();
        })
        .on('mousemove', '.country-pi', function(e) {
            TOOL_TIP_TEXT.css({
                top: (e.pageY - TOOL_TIP_TEXT.outerHeight() - 5),
                left: (e.pageX - TOOL_TIP_TEXT.outerWidth() - 5)
            });
        });

    function animateTotalVal(currentVal, currentPos, limit) {
        var cv = currentVal;
        var cp = currentPos;
        var d = data;
        cv += d[cp].val;

        $('.total-val').html('&#8364; ' + cv.toFixed(2));
        if (cp == limit - 1) {
            return true;
        } else {
            cp++;
            setTimeout(function() {
                animateTotalVal(cv, cp, limit);
            }, (animateDuration / limit * 1000));
        }

    }
}(jQuery));
