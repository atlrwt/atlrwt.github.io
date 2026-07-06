---
title: "一条命令洞悉 Linux 磁盘全貌：深入了解 df 命令的输出结果"
description: "围绕 df -hT 的实际输出解释 Linux 文件系统、挂载点和 LVM 存储结构。"
publishDate: "2024-05-17T06:15:08+08:00"
categories:
  - "Ops"
tags:
  - "Linux"
draft: false
---

## 引言

我们在 Linux 服务器上进行开发或运维的时候经常会用到`df -hT`命令来查看磁盘空间的使用情况，本文主要对其输出结果进行讲解。

## 正文

### `df`命令

`df` (disk free) 命令用于显示磁盘空间的使用情况。在实际使用中，我们通常会带上`-h`和`-T`两个参数让输出结果更加易读。
- -h, --human-readable：将 Size 以 MB、GB 等格式输出。
- -T, --print-type：输出 Filesystem 的类型（Type）。

例如，我们通过`df -hT`命令查看一台 Linux server。

```bash
~$ df -hT
Filesystem               Type      Size  Used Avail Use% Mounted on
devtmpfs                 devtmpfs   16G  8.0K   16G   1% /dev
tmpfs                    tmpfs      16G  240K   16G   1% /dev/shm
tmpfs                    tmpfs      16G  2.5M   16G   1% /run
tmpfs                    tmpfs      16G     0   16G   0% /sys/fs/cgroup
/dev/sda3                btrfs      42G   17G   25G  41% /
/dev/sda2                vfat       20M  188K   20M   1% /boot/efi
/dev/sda3                btrfs      42G   17G   25G  41% /boot/grub2/x86_64-efi
/dev/sda3                btrfs      42G   17G   25G  41% /srv
/dev/mapper/vg-lvscripts ext4      974M   24K  907M   1% /scripts
/dev/mapper/vg-lvnsr     ext4      2.0G   24K  1.8G   1% /nsr
/dev/mapper/vg-lvtmp     ext4      2.9G  856M  1.9G  31% /tmp
/dev/mapper/vg-lvservice ext4       30G  1.1G   27G   4% /service
/dev/mapper/vg-lvdata    ext4       98G  4.8G   89G   6% /data
/dev/sda3                btrfs      42G   17G   25G  41% /var
/dev/sda3                btrfs      42G   17G   25G  41% /opt
/dev/sda3                btrfs      42G   17G   25G  41% /.snapshots
/dev/mapper/vg-lvcrash   ext4      7.8G   24K  7.4G   1% /var/crash
/dev/sda3                btrfs      42G   17G   25G  41% /home
/dev/sda3                btrfs      42G   17G   25G  41% /usr/local
/dev/sda3                btrfs      42G   17G   25G  41% /var/log
/dev/sda3                btrfs      42G   17G   25G  41% /var/tmp
/dev/sda3                btrfs      42G   17G   25G  41% /var/log/audit
tmpfs                    tmpfs     3.2G     0  3.2G   0% /run/user/0
tmpfs                    tmpfs     3.2G     0  3.2G   0% /run/user/1001
```

`df`命令会打印出如下几列信息：
> - 文件系统（Filesystem）：显示磁盘分区的标识。
> - 类型（Type）：文件系统的类型。
> - 容量（Size）：分区总大小。
> - 已用（Used）：已使用的空间量。
> - 可用（Avail）：剩余的可用空间。
> - 使用%（Use%）：已使用的百分比。
> - 挂载点（Mounted on）：文件系统挂载的位置。

我们可以将输出结果的文件系统分为四类：
- 物理硬盘（如/dev/sd2）
- LVM：一个灵活的磁盘管理方式，允许用户从物理硬盘中创建逻辑卷（如/dev/mapper/vg-lvdata）
- tmpfs：一种基于内存的文件系统，可以用于存储临时文件，提高访问速度。
- devtmpfs：主要用于挂载设备文件的文件系统，通常自动挂载在/dev下。

其中，LVM值得我们进一步展开聊一聊。

### LVM

LVM (Logic Volume Manager)：逻辑卷管理，可以弹性的调整 Filesystem 的容量。

LVM 的做法是先将几个实体的 partition（或 disk）通过软件整合成一块大的卷组（Volume Group），然后根据实际需求将卷组分区为可使用的逻辑卷（Logical Volume），之后就可以挂载使用了。

上面这段话涉及到了几个概念：

- 物理卷（Physical Volume, PV）：指硬盘或者硬盘分区，它可以被用来创建逻辑卷。在 Linux 操作系统中，特别是在使用 LVM 时，物理卷是构建更复杂存储解决方案的基础。我们可以把多个物理卷组合成一个卷组（Volume Group），进而创建一个或多个逻辑卷（Logical Volume），这样可以更灵活地管理存储空间。

- 卷组（Volume Group, VG）：通过LVM组合起来的大磁盘。

- 逻辑卷（Logical Volume, LV）：通过LVM组合起来的VG并不能直接用于Linux系统中，需要切分为LV才能被格式化使用。

- 物理区域（Physical Extent, PE）：LVM的最小储存区域，默认大小为4MB。因此，一个LVM的总容量可以表示为PE*PE的个数，例如某个LVM共有65536个使用默认容量的PE，则其总容量为4MB * 65536 / 1024MB = 256GB。

在 Linux 系统中，我们能够通过一些命令来查看 PV、VG 和 LV 的使用情况。

还是以开头这台机器为例，我们可以通过`pvscan`来搜寻系统里面任何具有 PV 的磁盘。

```bash
~$ sudo pvscan
  PV /dev/sdb VG vg lvm2 [215.00 GiB / 3.00 GiB free]
  Total: 1 [215.00 GiB] / in use: 1 [215.00 GiB] / in no VG: 0 [0 ]
```

可见，我们系统里面的 /dev/sdb 已经是 PV 格式，共有 215GiB 的空间。

还可以通过`pvdisplay`命令显示系统里面每个 PV 的信息。

```bash
~$ sudo pvdisplay
  --- Physical volume ---
  PV Name /dev/sdb
  VG Name vg
  PV Size 215.00 GiB / not usable 4.00 MiB
  Allocatable yes
  PE Size 4.00 MiB
  Total PE 55039
  Free PE 767
  Allocated PE 54272
  PV UUID xxxxxxxxxxx
```

类似的，我们也可以通过`vgscan`和`vgdisplay`命令来查看 VG 的信息。

```bash
~$ sudo vgscan
  Reading volume groups from cache.
  Found volume group "vg" using metadata type lvm2
```

```bash
~$ sudo vgdisplay
  --- Volume group ---
  VG Name vg
  System ID
  Format lvm2
  Metadata Areas 1
  Metadata Sequence No 8
  VG Access read/write
  VG Status resizable
  MAX LV 0
  Cur LV 7
  Open LV 7
  Max PV 0
  Cur PV 1
  Act PV 1
  VG Size 215.00 GiB                    
  PE Size 4.00 MiB
  Total PE 55039
  Alloc PE / Size 54272 / 212.00 GiB
  Free PE / Size 767 / 3.00 GiB
  VG UUID xxxxxxxxxxx
```

同样，LV 也有`lvscan`和`lvdisplay`这两个命令可供我们使用。

```bash
~$ sudo lvscan
  ACTIVE '/dev/vg/lvservice' [50.00 GiB] inherit
  ACTIVE '/dev/vg/lvdata' [100.00 GiB] inherit
  ACTIVE '/dev/vg/lvtmp' [3.00 GiB] inherit
  ACTIVE '/dev/vg/lvscripts' [1.00 GiB] inherit
  ACTIVE '/dev/vg/lvnsr' [2.00 GiB] inherit
  ACTIVE '/dev/vg/lvvarcrash' [8.00 GiB] inherit
  ACTIVE '/dev/vg/lvswap' [48.00 GiB] inherit
```

```bash
~$ sudo lvdisplay
  --- Logical volume ---
  LV Path /dev/vg/lvservice
  LV Name lvservice
  VG Name vg
  LV UUID xxxxxxxxxxxxxxx
  LV Write Access read/write
  LV Creation host, time ubuntu-server, 2024-03-14 13:28:57 +0800
  LV Status available
  # open 1
  LV Size 50.00 GiB
  Current LE 12800
  Segments 1
  Allocation inherit
  Read ahead sectors auto
  - currently set to 1024
  Block device 254:1

  --- Logical volume ---
  LV Path /dev/vg/lvdata
  LV Name lvdata
  VG Name vg
  LV UUID xxxxxxxxxxxxxx
  LV Write Access read/write
  LV Creation host, time ubuntu-server, 2024-03-14 13:29:12 +0800
  LV Status available
  # open 1
  LV Size 100.00 GiB
  Current LE 25600
  Segments 1
  Allocation inherit
  Read ahead sectors auto
  - currently set to 1024
  Block device 254:2

  --- Logical volume ---
  LV Path /dev/vg/lvtmp
  LV Name lvtmp
  VG Name vg
  LV UUID xxxxxxxxxx
  LV Write Access read/write
  LV Creation host, time ubuntu-server, 2024-03-14 +0800
  LV Status available
  # open 1
  LV Size 3.00 GiB
  Current LE 768
  Segments 1
  Allocation inherit
  Read ahead sectors auto
  - currently set to 1024
  Block device 254:3

  --- Logical volume ---
  LV Path /dev/vg/lvscripts
  LV Name lvscripts
  VG Name vg
  LV UUID xxxxxxxxxxxxx
  LV Write Access read/write
  LV Creation host, time ubuntu-server, 2024-03-14 13:29:52 +0800
  LV Status available
  # open 1
  LV Size 1.00 GiB
  Current LE 256
  Segments 1
  Allocation inherit
  Read ahead sectors auto
  - currently set to 1024
  Block device 254:4

  --- Logical volume ---
  LV Path /dev/vg/lvnsr
  LV Name lvnsr
  VG Name vg
  LV UUID xxxxxxxxxxxxx
  LV Write Access read/write
  LV Creation host, time ubuntu-server, 2024-03-14 13:30:09 +0800
  LV Status available
  # open 1
  LV Size 2.00 GiB
  Current LE 512
  Segments 1
  Allocation inherit
  Read ahead sectors auto
  - currently set to 1024
  Block device 254:5

  --- Logical volume ---
  LV Path /dev/vg/lvvarcrash
  LV Name lvvarcrash
  VG Name vg
  LV UUID xxxxxxxxxxxxxx
  LV Write Access read/write
  LV Creation host, time ubuntu-server, 2024-03-14 13:30:51 +0800
  LV Status available
  # open 1
  LV Size 8.00 GiB
  Current LE 2048
  Segments 1
  Allocation inherit
  Read ahead sectors auto
  - currently set to 1024
  Block device 254:6

  --- Logical volume ---
  LV Path /dev/vg/lvswap
  LV Name lvswap
  VG Name vg
  LV UUID xxxxxxxxxxxxx
  LV Write Access read/write
  LV Creation host, time ubuntu-server, 2024-03-14 13:31:57 +0800
  LV Status available
  # open 2
  LV Size 48.00 GiB
  Current LE 12288
  Segments 1
  Allocation inherit
  Read ahead sectors auto
  - currently set to 1024
  Block device 254:0
```

<center>- EOF -</center>
