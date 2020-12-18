import urllib.request

urls = []
with open('./out', 'r') as f:
    urls = [url.strip() for url in f.readlines()]
# print(urls)


def download_image(url, index):
    segments = url.split('/')
    title = ''
    for segment in segments:
        if 'jpg' in segment:
            title = segment.split('?')[0]
            break
    if not title:
        print('Download failed:', url)
        return
    print(title)
    urllib.request.urlretrieve(url, f'./images/{index}-{title}')
    print(f'Downloaded image {index}')


if __name__ == '__main__':
    for index, url in enumerate(urls):
        download_image(url, index)
