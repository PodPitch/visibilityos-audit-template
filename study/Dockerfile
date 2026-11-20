FROM python:3.13-slim-bookworm@sha256:a5a7017efc5969e00ae2b91c8eb0631049a569652aa4ffc4501769049ae45c72

LABEL org.opencontainers.image.title="VisibilityOS AI Answer Study Reproduction" \
      org.opencontainers.image.description="Reproduce the aggregate AI search study by VisibilityOS by PodPitch" \
      org.opencontainers.image.url="https://visibilityos.co/research/ai-answer-visibility" \
      org.opencontainers.image.source="https://github.com/PodPitch/visibilityos-audit-template"

WORKDIR /study
COPY reproduce.py ./
COPY dataset/engine-views.csv dataset/outcomes.csv ./dataset/
USER 65534:65534
ENTRYPOINT ["python", "reproduce.py"]
