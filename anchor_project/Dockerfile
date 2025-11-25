FROM rust:1.79-slim-bookworm

# 1. Setup Mirrors (Fixes apt-get 404s)
RUN rm -f /etc/apt/sources.list.d/*.sources && \
    echo "deb http://ftp.us.debian.org/debian bookworm main" > /etc/apt/sources.list && \
    echo "deb http://ftp.us.debian.org/debian bookworm-updates main" >> /etc/apt/sources.list && \
    echo "deb http://security.debian.org/debian-security bookworm-security main" >> /etc/apt/sources.list

# 2. Install Tools
RUN apt-get update && apt-get install -y --fix-missing \
    build-essential pkg-config libssl-dev udev curl git libudev-dev bzip2 wget \
    && rm -rf /var/lib/apt/lists/*

# 3. Install Solana MANUALLY (Cannot fail silently)
# We download the file directly, extract it, and move it to /usr/local/bin
WORKDIR /tmp
RUN wget -O solana.tar.bz2 https://github.com/solana-labs/solana/releases/download/v1.18.18/solana-release-x86_64-unknown-linux-gnu.tar.bz2 \
    && tar jxf solana.tar.bz2 \
    && cp -r solana-release/bin/* /usr/local/bin/ \
    && rm -rf solana.tar.bz2 solana-release

# 4. Install Anchor 0.29.0
RUN cargo install --git https://github.com/coral-xyz/anchor --tag v0.29.0 anchor-cli --locked

# 5. Fix the SBF/BPF Naming Issue PERMANENTLY inside the image
# This creates the copy NOW so you never have to do it in the run command
RUN cp /usr/local/bin/cargo-build-sbf /usr/local/bin/cargo-build-bpf

WORKDIR /workdir