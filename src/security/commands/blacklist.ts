export const DANGEROUS_PATTERNS: RegExp[] = [
  // rm perigoso: rm -rf, rm -fr, rm -r -f, espaços, unicode, etc
  /\brm\b[\s\\'"`]*-[rR]+[fF]+/,

  // remove diretórios críticos
  /\brm\b.*\b\/(bin|boot|dev|etc|lib|lib64|proc|root|run|sbin|sys|usr|var)\b/,

  // força apagamento do root
  /\brm\b.*\b\/\s*$/,

  // reboot / shutdown
  /\bshutdown\b/,
  /\breboot\b/,

  // dd formatando disco
  /\bdd\b.*(\/dev\/sda|\/dev\/nvme|\/dev\/mmcblk)/,

  // mkfs (formatar FS)
  /\bmkfs\./,

  // mount/umount (risco de desmontar rootfs)
  /\bmount\b/,
  /\bumount\b/,

  // iptables / firewall
  /\biptables\b/,
  /\bufw\b/,

  // mexer permissões globais
  /\bchmod\b.*\b777\b/,
  /\bchown\b.*\broot\b/,

  // matar init
  /\bkill\b\s+-9\s+1/,

  // fork bomb
  /:\(\)\s*\{\s*:\s*\|\s*:\s*;\s*\};/,

  // redirecionamento de destruição: > /etc/passwd
  />\s*\/etc\/\w+/,

  // tentativa de sobrescrever arquivos críticos
  /\b(>|>>)\s*\/(etc|boot|root|var|usr)\//,

  // scripts binários perigosos
  /\bwget\b.*\|\s*sh\b/,
  /\bcurl\b.*\|\s*sh\b/,
];
