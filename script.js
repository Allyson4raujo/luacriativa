
        // === WHATSAPP — encomenda da galeria ===
        function encomendarGaleria(nomePeca) {
            var mensagem =
                'Ola! Vi essa peca na galeria e quero encomendar!\n\n' +
                'Peca escolhida: *' + nomePeca + '*\n\n' +
                'Pode me passar mais informacoes e o valor?';
            var url = 'https://wa.me/558195433324?text=' + encodeURIComponent(mensagem);
            window.open(url, '_blank');
        }

        // === CARROSSEL DA VITRINE ===
        const track = document.querySelector('.carrossel-track');
        const cards = document.querySelectorAll('.carrossel-track .card');
        const prevBtn = document.querySelector('.carrossel-prev');
        const nextBtn = document.querySelector('.carrossel-next');
        const dotsContainer = document.getElementById('carrosselDots');

        let currentIndex = 0;

        function getVisibleCount() {
            if (window.innerWidth < 640) return 1;
            if (window.innerWidth < 900) return 2;
            return 3;
        }

        function totalPages() {
            return Math.ceil(cards.length / getVisibleCount());
        }

        function buildDots() {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalPages(); i++) {
                const dot = document.createElement('button');
                dot.className = 'carrossel-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', 'Página ' + (i + 1));
                dot.addEventListener('click', () => goTo(i));
                dotsContainer.appendChild(dot);
            }
        }

        function goTo(index) {
            const pages = totalPages();
            currentIndex = Math.max(0, Math.min(index, pages - 1));
            const cardWidth = cards[0].offsetWidth + 18;
            track.style.transform = 'translateX(-' + (currentIndex * getVisibleCount() * cardWidth) + 'px)';
            document.querySelectorAll('.carrossel-dot').forEach((d, i) => {
                d.classList.toggle('active', i === currentIndex);
            });
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= pages - 1;
        }

        prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
        nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

        window.addEventListener('resize', () => { buildDots(); goTo(0); });

        buildDots();
        goTo(0);

        // Menu mobile
        const toggle = document.querySelector('.menu-toggle');
        const nav = document.querySelector('nav');
        toggle.addEventListener('click', () => nav.classList.toggle('open'));

        // Filtros da galeria
        const filtros = document.querySelectorAll('.filtro-btn');
        const itens = document.querySelectorAll('.galeria-item');

        filtros.forEach(btn => {
            btn.addEventListener('click', () => {
                filtros.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filtro = btn.dataset.filtro;
                itens.forEach(item => {
                    if (filtro === 'todos' || item.dataset.categoria === filtro) {
                        item.style.display = '';
                        item.style.animation = 'fadeIn 0.3s ease';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });

        // Lightbox ao clicar na imagem
        itens.forEach(item => {
            const img = item.querySelector('img');
            const nomePeca = item.dataset.nome || img.alt || 'essa peça';

            item.addEventListener('click', (e) => {
                if (e.target.closest('.galeria-btn-wa')) return;

                const mensagemLightbox =
                    'Ola! Vi essa peca na galeria e quero encomendar!\n\n' +
                    'Peca escolhida: *' + nomePeca + '*\n\n' +
                    'Pode me passar mais informacoes e o valor?';

                const lb = document.createElement('div');
                lb.className = 'lightbox';
                lb.innerHTML = `
                    <div class="lightbox-inner">
                        <button class="lightbox-close">&times;</button>
                        <img src="${img.src}" alt="${img.alt}">
                        <p>${nomePeca}</p>
                        <a href="https://wa.me/558195433324?text=${encodeURIComponent(mensagemLightbox)}"
                           target="_blank" class="btn btn-primary" style="margin-top:16px">
                            <i class="fab fa-whatsapp"></i> Encomendar essa
                        </a>
                    </div>
                `;
                document.body.appendChild(lb);
                document.body.style.overflow = 'hidden';

                const fechar = () => { lb.remove(); document.body.style.overflow = ''; };

                lb.addEventListener('click', e => {
                    if (e.target === lb || e.target.classList.contains('lightbox-close')) fechar();
                });

                document.addEventListener('keydown', function onKey(e) {
                    if (e.key === 'Escape') { fechar(); document.removeEventListener('keydown', onKey); }
                });
            });
        });
