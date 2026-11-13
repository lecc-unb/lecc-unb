#!/usr/bin/env python3
"""
Otimiza as imagens de assets/ para WebP, redimensionando por categoria.

Uso:
    python scripts/otimizar-imagens.py            # converte e substitui
    python scripts/otimizar-imagens.py --dry-run  # so mostra o que faria

Requer: pip install Pillow

Cada categoria tem uma largura maxima coerente com o tamanho em que a imagem
e exibida no site. Os originais sao apagados apos a conversao (mantenha um
backup fora do repositorio). Rode de novo apos adicionar imagens novas.
"""
import argparse
import pathlib
import sys

from PIL import Image

RAIZ = pathlib.Path(__file__).resolve().parent.parent
ASSETS = RAIZ / "assets"

# pasta relativa a assets/ -> largura maxima em px
LARGURAS = {
    "icons": 256,            # logo e icones de rodape
    "equipe": 400,           # fotos circulares
    "imagens-jogos": 600,    # cards do acervo
    "livros": 600,           # capas
    "imagens-lab": 1400,     # carrossel e imagens largas
    "imagens-modelos": 900,  # cards do slider da home
}
QUALIDADE = 82
EXTENSOES = {".jpg", ".jpeg", ".png"}


def largura_maxima(caminho: pathlib.Path) -> int:
    rel = caminho.relative_to(ASSETS)
    return LARGURAS.get(rel.parts[0], 900)


def converter(origem: pathlib.Path, dry_run: bool) -> tuple[int, int]:
    destino = origem.with_suffix(".webp")
    antes = origem.stat().st_size

    if dry_run:
        print(f"  [dry-run] {origem.relative_to(RAIZ)} -> {destino.name}")
        return antes, antes

    with Image.open(origem) as img:
        # Atencao: img.info["transparency"] so existe em PNG de paleta.
        # Imagens RGBA/LA carregam o alfa no proprio modo, entao checar
        # apenas o info descartaria a transparencia (os icones viravam
        # um retangulo preto sobre o header escuro).
        tem_alpha = (
            img.mode in ("RGBA", "LA")
            or (img.mode == "P" and "transparency" in img.info)
        )

        if tem_alpha:
            img = img.convert("RGBA")
            # Se o canal alfa for totalmente opaco ele so ocupa espaco.
            if img.getchannel("A").getextrema()[0] == 255:
                img = img.convert("RGB")
                tem_alpha = False
        else:
            img = img.convert("RGB")

        maxl = largura_maxima(origem)
        if img.width > maxl:
            altura = round(img.height * maxl / img.width)
            img = img.resize((maxl, altura), Image.LANCZOS)

        img.save(destino, "WEBP", quality=QUALIDADE, method=6)

    depois = destino.stat().st_size
    origem.unlink()
    print(
        f"  {origem.relative_to(ASSETS)}  "
        f"{antes // 1024} KB -> {depois // 1024} KB "
        f"({100 - depois * 100 // max(antes, 1)}% menor)"
    )
    return antes, depois


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--dry-run", action="store_true", help="nao escreve nada")
    args = p.parse_args()

    if not ASSETS.is_dir():
        print(f"erro: {ASSETS} nao encontrado", file=sys.stderr)
        return 1

    arquivos = sorted(
        c for c in ASSETS.rglob("*")
        if c.is_file() and c.suffix.lower() in EXTENSOES
    )
    if not arquivos:
        print("Nada a converter: nenhum jpg/png em assets/.")
        return 0

    print(f"Convertendo {len(arquivos)} imagem(ns) para WebP...\n")
    total_antes = total_depois = 0
    for arq in arquivos:
        try:
            a, d = converter(arq, args.dry_run)
            total_antes += a
            total_depois += d
        except Exception as erro:
            print(f"  ! falhou em {arq.relative_to(ASSETS)}: {erro}", file=sys.stderr)

    mb = 1024 * 1024
    print(
        f"\nTotal: {total_antes / mb:.1f} MB -> {total_depois / mb:.1f} MB "
        f"({100 - total_depois * 100 // max(total_antes, 1)}% menor)"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
