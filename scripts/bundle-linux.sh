rm -rf build

mkdir build
mkdir build/linux
cp -r out/linux-unpacked/* build/linux

cp -r static build/linux/static

rm -rf dist
rm -rf out